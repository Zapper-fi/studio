import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
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

import { KyberswapElasticLiquidityPositionDataProps } from './kyberswap-elastic.liquidity.contract-position-fetcher';
import {
  KyberswapElasticLiquidityPositionContractData,
  KyberswapElasticPoolStateData,
} from './kyberswap-elastic.liquidity.types';
import { getSupplied, getRange } from './kyberswap-elastic.liquidity.utils';

type KyberswapElasticLiquidityContractPositionHelperParams = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
  positionId: BigNumberish;
  poolId: BigNumberish;
  network: Network;
  collapseClaimable?: boolean;
  kyberswapElasticLmAddress: string;
};

export class KyberswapElasticFarmContractPositionBuilder {
  positionManagerAddress = '0xe222fbe074a436145b255442d919e4e3a6c6a480';
  factoryAddress = '0xc7a590291e07b9fe9e64b86c58fd8fc764308c4a';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapElasticContractFactory) protected readonly contractFactory: KyberswapElasticContractFactory,
  ) {}

  async buildPosition({
    multicall,
    positionId,
    poolId,
    tokenLoader,
    network,
    collapseClaimable,
    kyberswapElasticLmAddress,
  }: KyberswapElasticLiquidityContractPositionHelperParams) {
    const positionManager = this.contractFactory.positionManager({ address: this.positionManagerAddress, network });
    const factoryContract = this.contractFactory.factory({ address: this.factoryAddress, network });
    const elasticLmContract = this.contractFactory.kyberswapElasticLm({ address: kyberswapElasticLmAddress, network });
    const position = await multicall.wrap(positionManager).positions(positionId);

    const fee = position.info?.fee;
    const poolInfo = await multicall.wrap(elasticLmContract).getPoolInfo(poolId);
    const rewardTokenAddresses = poolInfo.rewardTokens.map(x => x.toLowerCase());
    const token0Address = position.info.token0.toLowerCase();
    const token1Address = position.info.token1.toLowerCase();
    const queries = [token0Address, token1Address, ...rewardTokenAddresses].map(t => ({ address: t, network }));
    const [token0, token1, claimableToken] = await tokenLoader.getMany(queries);
    if (!token0 || !token1 || !claimableToken) return null;

    const poolAddr = await multicall.wrap(factoryContract).getPool(token0Address, token1Address, fee);
    const poolAddress = poolAddr.toLowerCase();
    const poolContract = this.contractFactory.pool({ address: poolAddress, network });
    const token0Contract = this.contractFactory.erc20(token0);
    const token1Contract = this.contractFactory.erc20(token1);

    const [liquidityState, poolState, positionClaimables, reserveRaw0, reserveRaw1] = await Promise.all([
      multicall.wrap(poolContract).getLiquidityState(),
      multicall.wrap(poolContract).getPoolState(),
      multicall.wrap(elasticLmContract).getUserInfo(positionId, poolId),
      multicall.wrap(token0Contract).balanceOf(poolAddress),
      multicall.wrap(token1Contract).balanceOf(poolAddress),
    ]);

    const positionData: KyberswapElasticLiquidityPositionContractData = {
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
    const state: KyberswapElasticPoolStateData = {
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

    // claimables
    const claimableTokens = [claimableToken].map(v => claimable(v));
    const claimablesBalance = positionClaimables.rewardPending.map(x => x.toString());
    const claimableTokenBalances = claimableTokens.map((t, i) => drillBalance(t, claimablesBalance[i]));

    // Build position price according to underlying reserves
    let tokens = [...suppliedTokenBalances, ...claimableTokenBalances].filter(t => t.balanceUSD > 0.01);
    const balanceUSD = sumBy(tokens, v => v.balanceUSD);

    const reservesRaw = [reserveRaw0, reserveRaw1];
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** suppliedTokens[i].decimals);
    const totalLiquidity = reserves[0] * suppliedTokens[0].price + reserves[1] * suppliedTokens[1].price;

    if (collapseClaimable) {
      tokens = [token0, token1].map((t, i) =>
        drillBalance(t, new BigNumber(suppliedBalances[i]).plus(claimablesBalance[i]).toFixed(0)),
      );
    }

    const feeTier = Number(fee) / 10 ** 4;
    const dataProps: KyberswapElasticLiquidityPositionDataProps = {
      feeTier,
      rangeStart: range[0],
      rangeEnd: range[1],
      liquidity: totalLiquidity,
      reserves: reserves,
      poolAddress: poolAddr.toLowerCase(),
      assetStandard: Standard.ERC_721,
      positionKey: `${feeTier}`,
    };

    const displayProps = {
      label: `${token0.symbol} / ${token1.symbol} (${range[0]} to ${range[1]})`,
      images: [...getImagesFromToken(token0), ...getImagesFromToken(token1)],
      statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(Number(state.liquidity)) }],
    };

    const balance: ContractPositionBalance<KyberswapElasticLiquidityPositionDataProps> = {
      type: ContractType.POSITION,
      address: this.positionManagerAddress,
      appId: 'kyberswap-elastic',
      groupId: 'farm',
      network,
      tokens,
      dataProps,
      displayProps,
      balanceUSD,
    };

    balance.key = this.appToolkit.getPositionKey(balance);

    return balance;
  }
}
