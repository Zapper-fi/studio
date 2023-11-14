import { BigNumber } from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { sumBy } from 'lodash';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ViemMulticallDataLoader } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Standard, Token } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';
import { Network } from '~types';

import { UniswapV3LiquidityPositionDataProps } from './uniswap-v3.liquidity.contract-position-fetcher';
import {
  UniswapV3LiquidityPositionContractData,
  UniswapV3LiquiditySlotContractData,
  UniswapV3LiquidityTickContractData,
} from './uniswap-v3.liquidity.types';
import { getClaimable } from './uniswap-v3.liquidity.utils';

type UniswapV3LiquidityContractPositionHelperParams = {
  multicall: ViemMulticallDataLoader;
  tokenLoader: TokenDependencySelector;
  positionId: BigNumberish;
  network: Network;
  collapseClaimable?: boolean;
};

export abstract class AbstractUniswapV3LiquidityContractPositionBuilder<
  PoolAbi extends Abi,
  FactoryAbi extends Abi,
  PositionManagerAbi extends Abi,
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
    liquidity: BigNumberish;
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
    liquidity: BigNumberish;
  });

  abstract getPositionManager(network: Network): GetContractReturnType<PositionManagerAbi, PublicClient>;
  abstract getFactoryContract(network: Network): GetContractReturnType<FactoryAbi, PublicClient>;
  abstract getPoolContract(network: Network, address: string): GetContractReturnType<PoolAbi, PublicClient>;

  abstract getPoolAddress(
    contract: GetContractReturnType<FactoryAbi, PublicClient>,
    token0: string,
    token1: string,
    fee: BigNumberish,
  ): Promise<string>;

  abstract getPosition(
    contract: GetContractReturnType<PositionManagerAbi, PublicClient>,
    positionId: BigNumberish,
  ): Promise<UniswapV3LiquidityPositionContractData>;

  abstract getSlot0(
    contract: GetContractReturnType<PoolAbi, PublicClient>,
  ): Promise<UniswapV3LiquiditySlotContractData>;

  abstract getTickSpacing(contract: GetContractReturnType<PoolAbi, PublicClient>): Promise<BigNumberish>;

  abstract getLiquidity(contract: GetContractReturnType<PoolAbi, PublicClient>): Promise<BigNumberish>;

  abstract getFeeGrowthGlobal0X128(contract: GetContractReturnType<PoolAbi, PublicClient>): Promise<BigNumberish>;

  abstract getFeeGrowthGlobal1X128(contract: GetContractReturnType<PoolAbi, PublicClient>): Promise<BigNumberish>;

  abstract getTick(
    contract: GetContractReturnType<PoolAbi, PublicClient>,
    tick: BigNumberish,
  ): Promise<UniswapV3LiquidityTickContractData>;

  async getTokensForPosition({
    multicall,
    positionId,
    tokenLoader,
    network,
  }: UniswapV3LiquidityContractPositionHelperParams) {
    const positionManagerContract = multicall.wrap(this.getPositionManager(network));
    const position = await this.getPosition(positionManagerContract, positionId);

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
    const positionManagerContract = multicall.wrap(this.getPositionManager(network));
    const factoryContract = multicall.wrap(this.getFactoryContract(network));
    const position = await this.getPosition(positionManagerContract, positionId);

    const [token0, token1] = await this.getTokensForPosition({ multicall, positionId, tokenLoader, network });
    if (!token0 || !token1) return null;

    const fee = position.fee;
    const poolAddress = await this.getPoolAddress(factoryContract, token0.address, token1.address, fee);
    const poolContract = multicall.wrap(this.getPoolContract(network, poolAddress));

    const token0Contract = this.appToolkit.globalViemContracts.erc20(token0);
    const token1Contract = this.appToolkit.globalViemContracts.erc20(token1);

    const [slot, tickSpacing, liquidity, feeGrowth0, feeGrowth1, ticksLower, ticksUpper, reserveRaw0, reserveRaw1] =
      await Promise.all([
        this.getSlot0(poolContract),
        this.getTickSpacing(poolContract),
        this.getLiquidity(poolContract),
        this.getFeeGrowthGlobal0X128(poolContract),
        this.getFeeGrowthGlobal1X128(poolContract),
        this.getTick(poolContract, position.tickLower),
        this.getTick(poolContract, position.tickUpper),
        multicall.wrap(token0Contract).read.balanceOf([poolContract.address]),
        multicall.wrap(token1Contract).read.balanceOf([poolContract.address]),
      ]);

    // Retrieve underlying reserves, both supplied and claimable
    const range = this.getRange({ position, slot, token0, token1, network, liquidity });
    const suppliedBalances = this.getSupplied({ position, slot, token0, token1, network, liquidity });

    const minTick = Math.floor(-this.MIN_TICK / Number(tickSpacing));
    const maxTick = Math.floor(this.MAX_TICK / Number(tickSpacing));
    const tickLower = Math.floor(Number(-position.tickLower) / Number(tickSpacing));
    const tickUpper = Math.floor(Number(position.tickUpper) / Number(tickSpacing));
    const isMin = tickLower === minTick;
    const isMax = tickUpper === maxTick;

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
