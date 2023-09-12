import { Inject } from '@nestjs/common';
import { Token as PancakeSwapToken } from '@pancakeswap/swap-sdk-core';
import { Pool, Position, TickMath } from '@pancakeswap/v3-sdk';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AbstractUniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.abstract.contract-position-builder';
import {
  UniswapV3LiquidityPositionContractData,
  UniswapV3LiquiditySlotContractData,
} from '~apps/uniswap-v3/common/uniswap-v3.liquidity.types';
import { Erc20 } from '~contract/contracts';
import { IMulticallWrapper } from '~multicall';
import { Token } from '~position/position.interface';
import { TokenDependency } from '~position/selectors/token-dependency-selector.interface';
import { Network, NETWORK_IDS } from '~types/network.interface';

import {
  PancakeswapFactory,
  PancakeswapNfPositionManager,
  PancakeswapPool,
  PancakeswapV3ContractFactory,
} from '../contracts';

export class PancakeswapV3LiquidityContractPositionBuilder extends AbstractUniswapV3LiquidityContractPositionBuilder<
  PancakeswapPool,
  PancakeswapFactory,
  PancakeswapNfPositionManager
> {
  managerAddress = '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364';
  factoryAddress = '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865';
  appId = 'pancakeswap-v3';

  protected MIN_TICK = TickMath.MIN_TICK;
  protected MAX_TICK = TickMath.MAX_TICK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapV3ContractFactory) protected readonly contractFactory: PancakeswapV3ContractFactory,
  ) {
    super();
  }

  getRange({
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
    liquidity: BigNumber;
  }) {
    const sqrtPriceX96 = slot.sqrtPriceX96; // sqrt(token1/token0) Q64.96 value
    const tickCurrent = Number(slot.tick);

    const tickLower = Number(position.tickLower);
    const tickUpper = Number(position.tickUpper);
    const feeBips = Number(position.fee);

    const networkId = NETWORK_IDS[network]!;
    const t0Wrapper = new PancakeSwapToken(networkId, token0.address, token0.decimals, token0.symbol);
    const t1Wrapper = new PancakeSwapToken(networkId, token1.address, token1.decimals, token1.symbol);
    const pool = new Pool(t0Wrapper, t1Wrapper, feeBips, sqrtPriceX96.toString(), liquidity.toString(), tickCurrent);
    const positionZ = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });

    const positionLowerBound = Number(positionZ.token0PriceLower.toSignificant(4));
    const positionUpperBound = Number(positionZ.token0PriceUpper.toSignificant(4));
    return [positionLowerBound, positionUpperBound];
  }

  getSupplied({
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
    liquidity: BigNumber;
  }) {
    const tickLower = Number(position.tickLower);
    const tickUpper = Number(position.tickUpper);
    const feeBips = Number(position.fee);

    const networkId = NETWORK_IDS[network]!;
    const t0 = new PancakeSwapToken(networkId, token0.address, token0.decimals, token0.symbol);
    const t1 = new PancakeSwapToken(networkId, token1.address, token1.decimals, token1.symbol);
    const pool = new Pool(t0, t1, feeBips, slot.sqrtPriceX96.toString(), liquidity.toString(), Number(slot.tick));
    const pos = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });

    const token0BalanceRaw = pos.amount0.multiply(10 ** token0.decimals).toFixed(0);
    const token1BalanceRaw = pos.amount1.multiply(10 ** token1.decimals).toFixed(0);
    return [token0BalanceRaw, token1BalanceRaw];
  }

  async getPoolContract({
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
  }): Promise<PancakeswapPool> {
    const factoryContract = this.contractFactory.pancakeswapFactory({ address: this.factoryAddress, network });
    const poolAddr = await multicall.wrap(factoryContract).getPool(token0, token1, fee);
    return this.contractFactory.pancakeswapPool({ address: poolAddr.toLowerCase(), network });
  }

  getFactoryContract(network: Network): PancakeswapFactory {
    return this.contractFactory.pancakeswapFactory({ address: this.factoryAddress, network });
  }

  getERC20(tokenDep: TokenDependency): Erc20 {
    return this.contractFactory.erc20(tokenDep);
  }

  getPositionManager(network: Network): PancakeswapNfPositionManager {
    return this.contractFactory.pancakeswapNfPositionManager({ address: this.managerAddress, network });
  }
}
