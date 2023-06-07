import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
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

import { PancakeswapV3ContractFactory } from '../contracts';

import { NonFungiblePancakeswapV3PositionDataProps } from './pancakeswap-v3.liquidity.contract-position-fetcher';
import { getSupplied, getClaimable, getRange } from './pancakeswap-v3.liquidity.utils';

type PancakeswapV3LiquidityContractPositionHelperParams = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
  positionId: BigNumberish;
  network: Network;
  collapseClaimable?: boolean;
};

export class PancakeswapV3LiquidityContractPositionBuilder {
  managerAddress = '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364';
  factoryAddress = '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865';
  // masterchefAddress = '0x556b9306565093c855aea9ae92a594704c2cd59e';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapV3ContractFactory) protected readonly contractFactory: PancakeswapV3ContractFactory,
  ) { }

  async getTokensForPosition({
    multicall,
    positionId,
    tokenLoader,
    network,
  }: PancakeswapV3LiquidityContractPositionHelperParams) {
    const positionManager = this.contractFactory.pancakeswapNfPositionManager({
      address: this.managerAddress,
      network,
    });

    const position = await multicall.wrap(positionManager).positions(positionId);

    const token0Address = position.token0.toLowerCase();
    const token1Address = position.token1.toLowerCase();
    const queries = [token0Address, token1Address].map(t => ({ address: t, network }));

    const [token0, token1] = await tokenLoader.getMany(queries);
    return [token0, token1];
  }

  async buildPosition({
    multicall,
    positionId,
    tokenLoader,
    network,
    collapseClaimable,
  }: PancakeswapV3LiquidityContractPositionHelperParams) {
    const positionManager = this.contractFactory.pancakeswapNfPositionManager({
      address: this.managerAddress,
      network,
    });
    const factoryContract = this.contractFactory.pancakeswapFactory({ address: this.factoryAddress, network });

    const position = await multicall.wrap(positionManager).positions(positionId);

    const [token0, token1] = await this.getTokensForPosition({ multicall, positionId, tokenLoader, network });
    if (!token0 || !token1) return null;

    const fee = position.fee;
    const poolAddr = await multicall.wrap(factoryContract).getPool(token0.address, token1.address, fee);
    const poolAddress = poolAddr.toLowerCase();

    // const masterChefContract = this.contractFactory.pancakeswapMasterchef({ address: this.masterchefAddress, network });
    // const poolInfo = await masterChefContract.poolInfo(poolAddress);

    const poolContract = this.contractFactory.pancakeswapPool({ address: poolAddress, network });

    const token0Contract = this.contractFactory.erc20(token0);
    const token1Contract = this.contractFactory.erc20(token1);

    const [slot, tickSpacing, liquidity, feeGrowth0, feeGrowth1, ticksLower, ticksUpper, reserveRaw0, reserveRaw1] =
      await Promise.all([
        multicall.wrap(poolContract).slot0(),
        multicall.wrap(poolContract).tickSpacing(),
        multicall.wrap(poolContract).liquidity(),
        multicall.wrap(poolContract).feeGrowthGlobal0X128(),
        multicall.wrap(poolContract).feeGrowthGlobal1X128(),
        multicall.wrap(poolContract).ticks(Number(position.tickLower)),
        multicall.wrap(poolContract).ticks(Number(position.tickUpper)),
        multicall.wrap(token0Contract).balanceOf(poolAddress),
        multicall.wrap(token1Contract).balanceOf(poolAddress),
      ]);

    const range = getRange({ position, slot, token0, token1, network, liquidity });

    const suppliedBalances = getSupplied({ position, slot, token0, token1, network, liquidity });
    const isMin = Math.floor(-position.tickLower / tickSpacing) === Math.floor(-887272 / tickSpacing);
    const isMax = Math.floor(position.tickUpper / tickSpacing) === Math.floor(887272 / tickSpacing);

    const suppliedTokens = [token0, token1].map(v => supplied(v));
    const suppliedTokenBalances = suppliedTokens.map((t, i) => drillBalance(t, suppliedBalances[i]));

    const claimableBalances = getClaimable({ position, slot, ticksLower, ticksUpper, feeGrowth0, feeGrowth1 });
    const claimableTokens = [token0, token1].map(v => claimable(v));
    const claimableTokenBalances = claimableTokens.map((t, i) => drillBalance(t, claimableBalances[i]));

    // Build position price according to underlying reserves, prune anything less than 1c
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

    const feeTier = Number(fee) / 10 ** 4;

    const dataProps: NonFungiblePancakeswapV3PositionDataProps = {
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
      label: `${token0.symbol} / ${token1.symbol} (${isMin ? 'MIN' : range[0]} - ${isMax ? 'MAX' : range[1]})`,
      images: [...getImagesFromToken(token0), ...getImagesFromToken(token1)],
      statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(Number(liquidity)) }],
    };

    const balance: ContractPositionBalance<NonFungiblePancakeswapV3PositionDataProps> = {
      type: ContractType.POSITION,
      address: this.managerAddress,
      appId: 'pancakeswap-v3',
      groupId: 'liquidity',
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
