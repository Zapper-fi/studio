import { BigNumber } from 'bignumber.js';
import { BaseContract, BigNumber as EtherBigNumber, BigNumberish } from 'ethers';
import { sumBy } from 'lodash';

import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import { IMulticallWrapper } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Standard, Token } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { TokenDependency, TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';
import { Network } from '~types';

import { UniswapV3Pool, UniswapV3PositionManager } from '../contracts';

import { UniswapV3LiquidityPositionDataProps } from './uniswap-v3.liquidity.contract-position-fetcher';
import {
  UniswapV3LiquidityPositionContractData,
  UniswapV3LiquiditySlotContractData,
  UniswapV3LiquidityTickContractData,
} from './uniswap-v3.liquidity.types';
import { getClaimable } from './uniswap-v3.liquidity.utils';

type UniswapV3LiquidityContractPositionHelperParams = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
  positionId: BigNumberish;
  network: Network;
  collapseClaimable?: boolean;
};

type IUniswapV3Pool = BaseContract & {
  slot0: UniswapV3Pool['slot0'];
  tickSpacing: UniswapV3Pool['tickSpacing'];
  liquidity: UniswapV3Pool['liquidity'];
  feeGrowthGlobal0X128: UniswapV3Pool['feeGrowthGlobal0X128'];
  feeGrowthGlobal1X128: UniswapV3Pool['feeGrowthGlobal1X128'];
  ticks: (n: number) => Promise<UniswapV3LiquidityTickContractData>;
};

type IUniswapPositionManager = BaseContract & {
  positions: UniswapV3PositionManager['positions'];
};

export abstract class AbstractUniswapV3LiquidityContractPositionBuilder<
  V3PoolType extends IUniswapV3Pool,
  V3FactoryType,
  PositionManagerType extends IUniswapPositionManager,
> {
  protected readonly managerAddress: string;
  protected readonly factoryAddress: string;
  protected readonly appId: string;
  protected readonly appToolkit: IAppToolkit;

  protected readonly MIN_TICK: number;
  protected readonly MAX_TICK: number;

  abstract getRange({
    position,
    slot,
    token0,
    token1,
    network,
    liquidity,
  }: {
    position: UniswapV3LiquidityPositionContractData;
    slot: UniswapV3LiquiditySlotContractData;
    token0: Token;
    token1: Token;
    network: Network;
    liquidity: EtherBigNumber;
  });

  abstract getSupplied({
    position,
    slot,
    token0,
    token1,
    network,
    liquidity,
  }: {
    position: UniswapV3LiquidityPositionContractData;
    slot: UniswapV3LiquiditySlotContractData;
    token0: Token;
    token1: Token;
    network: Network;
    liquidity: EtherBigNumber;
  });

  abstract getPoolContract({
    token0,
    token1,
    fee,
    multicall,
    network,
  }: {
    token0: string;
    token1: string;
    fee: number;
    multicall: IMulticallWrapper;
    network: Network;
  }): Promise<V3PoolType>;
  abstract getPositionManager(network: Network): PositionManagerType;
  abstract getFactoryContract(network: Network): V3FactoryType;
  abstract getERC20(tokenDep: TokenDependency): Erc20;

  async getTokensForPosition({
    multicall,
    positionId,
    tokenLoader,
    network,
  }: UniswapV3LiquidityContractPositionHelperParams) {
    const position = await multicall.wrap(this.getPositionManager(network)).positions(positionId);

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
  }: UniswapV3LiquidityContractPositionHelperParams) {
    const positionManager = this.getPositionManager(network);
    const position = await multicall.wrap(positionManager).positions(positionId);

    const [token0, token1] = await this.getTokensForPosition({ multicall, positionId, tokenLoader, network });
    if (!token0 || !token1) return null;

    const fee = position.fee;

    const poolContract = await this.getPoolContract({
      token0: token0.address,
      token1: token1.address,
      fee,
      network,
      multicall,
    });

    const token0Contract = this.getERC20(token0);
    const token1Contract = this.getERC20(token1);

    const [slot, tickSpacing, liquidity, feeGrowth0, feeGrowth1, ticksLower, ticksUpper, reserveRaw0, reserveRaw1] =
      await Promise.all([
        multicall.wrap(poolContract).slot0(),
        multicall.wrap(poolContract).tickSpacing(),
        multicall.wrap(poolContract).liquidity(),
        multicall.wrap(poolContract).feeGrowthGlobal0X128(),
        multicall.wrap(poolContract).feeGrowthGlobal1X128(),
        multicall.wrap(poolContract).ticks(Number(position.tickLower)),
        multicall.wrap(poolContract).ticks(Number(position.tickUpper)),
        multicall.wrap(token0Contract).balanceOf(poolContract.address),
        multicall.wrap(token1Contract).balanceOf(poolContract.address),
      ]);

    // Retrieve underlying reserves, both supplied and claimable
    const range = this.getRange({ position, slot, token0, token1, network, liquidity });
    const suppliedBalances = this.getSupplied({ position, slot, token0, token1, network, liquidity });
    const isMin = Math.floor(-position.tickLower / tickSpacing) === Math.floor(-this.MIN_TICK / tickSpacing);
    const isMax = Math.floor(position.tickUpper / tickSpacing) === Math.floor(this.MAX_TICK / tickSpacing);

    const suppliedTokens = [token0, token1].map(v => supplied(v));
    const suppliedTokenBalances = suppliedTokens.map((t, i) => drillBalance(t, suppliedBalances[i]));
    const claimableBalances = getClaimable({ position, slot, ticksLower, ticksUpper, feeGrowth0, feeGrowth1 });
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

    const feeTier = Number(fee) / 10 ** 4;
    const dataProps: UniswapV3LiquidityPositionDataProps = {
      feeTier,
      rangeStart: range[0],
      rangeEnd: range[1],
      liquidity: totalLiquidity,
      reserves: reserves,
      poolAddress: poolContract.address.toLowerCase(),
      assetStandard: Standard.ERC_721,
      positionKey: `${feeTier}`,
    };

    const displayProps = {
      label: `${token0.symbol} / ${token1.symbol} (${isMin ? 'MIN' : range[0]} - ${isMax ? 'MAX' : range[1]})`,
      images: [...getImagesFromToken(token0), ...getImagesFromToken(token1)],
      statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(Number(liquidity)) }],
    };

    const balance: ContractPositionBalance<UniswapV3LiquidityPositionDataProps> = {
      type: ContractType.POSITION,
      address: this.managerAddress,
      appId: this.appId,
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
