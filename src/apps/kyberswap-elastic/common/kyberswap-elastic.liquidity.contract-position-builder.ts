import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Standard } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';
import { Network } from '~types/network.interface';

import { KyberswapElasticContractFactory } from '../contracts';
import { KYBERSWAP_ELASTIC_DEFINITION } from '../kyberswap-elastic.definition';

import { KyberSwapElasticLiquidityPositionDataProps } from './kyberswap-elastic.liquidity.contract-position-fetcher';
import {
  KyberSwapElasticLiquidityPositionContractData,
  KyberSwapElasticPoolStateData,
} from './kyberswap-elastic.liquidity.types';
import { getSupplied, getRange } from './kyberswap-elastic.liquidity.utils';

type KyberSwapElasticLiquidityContractPositionHelperParams = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
  positionId: BigNumberish;
  network: Network;
  collapseClaimable?: boolean;
};

export class KyberSwapElasticLiquidityContractPositionBuilder {
  managerAddress = '0x2b1c7b41f6a8f2b2bc45c3233a5d5fb3cd6dc9a8';
  factoryAddress = '0x5f1dddbf348ac2fbe22a163e30f99f9ece3dd50a';
  tickerReaderAddress = '0x165c68077ac06c83800d19200e6e2b08d02de75d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapElasticContractFactory) protected readonly contractFactory: KyberswapElasticContractFactory,
  ) {}

  async buildPosition({
    multicall,
    positionId,
    tokenLoader,
    network,
    collapseClaimable,
  }: KyberSwapElasticLiquidityContractPositionHelperParams) {
    const positionManager = this.contractFactory.positionManager({ address: this.managerAddress, network });
    const factoryContract = this.contractFactory.factory({ address: this.factoryAddress, network });
    const position = await multicall.wrap(positionManager).positions(positionId);

    const fee = position.info?.fee;
    const token0Address = position.info.token0.toLowerCase();
    const token1Address = position.info.token1.toLowerCase();
    const queries = [token0Address, token1Address].map(t => ({ address: t, network }));
    const [token0, token1] = await tokenLoader.getMany(queries);
    if (!token0 || !token1) return null;

    const poolAddr = await multicall.wrap(factoryContract).getPool(token0Address, token1Address, fee);
    const poolAddress = poolAddr.toLowerCase();
    const poolContract = this.contractFactory.pool({ address: poolAddress, network });
    const tickReaderContract = this.contractFactory.tickReader({ address: this.tickerReaderAddress, network });
    const token0Contract = this.contractFactory.erc20(token0);
    const token1Contract = this.contractFactory.erc20(token1);

    const [liquidityState, poolState, claimableBalances, reserveRaw0, reserveRaw1] = await Promise.all([
      multicall.wrap(poolContract).getLiquidityState(),
      multicall.wrap(poolContract).getPoolState(),
      multicall.wrap(tickReaderContract).getTotalRTokensOwedToPosition(this.managerAddress, poolAddress, positionId),
      multicall.wrap(token0Contract).balanceOf(poolAddress),
      multicall.wrap(token1Contract).balanceOf(poolAddress),
    ]);

    const positionData: KyberSwapElasticLiquidityPositionContractData = {
      tickLower: position.pos.tickLower,
      tickUpper: position.pos.tickUpper,
      liquidity: position.pos.liquidity,
      rTokenOwed: position.pos.rTokenOwed,
      feeGrowthInsideLast: position.pos.feeGrowthInsideLast,
      nonce: position.pos.nonce,
      operator: position.pos.operator,
      poolId: position.pos.poolId,
      token0: position.info.token0,
      token1: position.info.token1,
      fee: fee,
    };
    const state: KyberSwapElasticPoolStateData = {
      sqrtPriceX96: poolState.sqrtP,
      reinvestL: liquidityState.reinvestL,
      currentTick: poolState.currentTick,
      liquidity: liquidityState.baseL,
    };
    // Retrieve underlying reserves, both supplied and claimable
    const range = getRange({ position: positionData, state, token0, token1, network });
    const suppliedBalances = getSupplied({ position: positionData, state, token0, token1, network });

    const suppliedTokens = [token0, token1].map(v => supplied(v));
    const suppliedTokenBalances = suppliedTokens.map((t, i) => drillBalance(t, suppliedBalances[i]));
    const claimableTokens = [token0, token1].map(v => claimable(v));
    const claimableTokenBalances = claimableTokens.map((t, i) => drillBalance(t, claimableBalances[i]));

    // Build position price according to underlying reserves
    let tokens = [...suppliedTokenBalances, ...claimableTokenBalances].filter(t => t.balanceUSD > 0.01);
    const balanceUSD = sumBy(tokens, v => v.balanceUSD);

    const reservesRaw = [reserveRaw0, reserveRaw1];
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** suppliedTokens[i].decimals);
    const totalLiquidity = reserves[0] * suppliedTokens[0].price + reserves[1] * suppliedTokens[1].price;

    if (collapseClaimable) {
      tokens = [token0, token1].map((t, i) =>
        drillBalance(t, new BigNumber(suppliedBalances[i]).plus(claimableBalances[i]).toFixed(0)),
      );
    }

    const dataProps: KyberSwapElasticLiquidityPositionDataProps = {
      feeTier: Number(fee) / 10 ** 4,
      rangeStart: range[0],
      rangeEnd: range[1],
      liquidity: totalLiquidity,
      reserves: reserves,
      poolAddress: poolAddr.toLowerCase(),
      assetStandard: Standard.ERC_721,
    };

    const displayProps = {
      label: `${token0.symbol} / ${token1.symbol} (${range[0]} to ${range[1]})`,
      images: [...getImagesFromToken(token0), ...getImagesFromToken(token1)],
      statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(Number(state.liquidity)) }],
    };

    const balance: ContractPositionBalance<KyberSwapElasticLiquidityPositionDataProps> = {
      type: ContractType.POSITION,
      address: this.managerAddress,
      appId: KYBERSWAP_ELASTIC_DEFINITION.id,
      groupId: KYBERSWAP_ELASTIC_DEFINITION.groups.liquidity.id,
      network,
      tokens,
      dataProps,
      displayProps,
      balanceUSD,
    };

    return balance;
  }
}
