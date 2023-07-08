import { Inject } from '@nestjs/common';
import { Token as TokenWrapper } from '@uniswap/sdk-core';
import { Pool, Position, TickMath } from '@uniswap/v3-sdk';
import { BigNumber as EtherBigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  UniswapV3ContractFactory,
  UniswapV3Factory,
  UniswapV3Pool,
  UniswapV3PositionManager,
} from '~apps/uniswap-v3/contracts';
import { Erc20 } from '~contract/contracts';
import { IMulticallWrapper } from '~multicall';
import { Token } from '~position/position.interface';
import { TokenDependency } from '~position/selectors/token-dependency-selector.interface';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { AbstractUniswapV3LiquidityContractPositionBuilder } from './uniswap-v3.liquidity.abstract.contract-position-builder';
import {
  UniswapV3LiquidityPositionContractData,
  UniswapV3LiquiditySlotContractData,
} from './uniswap-v3.liquidity.types';

export class UniswapV3LiquidityContractPositionBuilder extends AbstractUniswapV3LiquidityContractPositionBuilder<
  UniswapV3Pool,
  UniswapV3Factory,
  UniswapV3PositionManager
> {
  managerAddress = '0xaa277cb7914b7e5514946da92cb9de332ce610ef';
  factoryAddress = '0xaa2cd7477c451e703f3b9ba5663334914763edf8';
  appId = 'ramses-v2';

  protected MIN_TICK = TickMath.MIN_TICK;
  protected MAX_TICK = TickMath.MAX_TICK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV3ContractFactory) protected readonly contractFactory: UniswapV3ContractFactory,
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
    liquidity: EtherBigNumber;
  }) {
    const sqrtPriceX96 = slot.sqrtPriceX96; // sqrt(token1/token0) Q64.96 value
    const tickCurrent = Number(slot.tick);

    const tickLower = Number(position.tickLower);
    const tickUpper = Number(position.tickUpper);
    const feeBips = Number(position.fee);

    const networkId = NETWORK_IDS[network]!;
    const t0Wrapper = new TokenWrapper(networkId, token0.address, token0.decimals, token0.symbol);
    const t1Wrapper = new TokenWrapper(networkId, token1.address, token1.decimals, token1.symbol);
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
    liquidity: EtherBigNumber;
  }) {
    const tickLower = Number(position.tickLower);
    const tickUpper = Number(position.tickUpper);
    const feeBips = Number(position.fee);

    const networkId = NETWORK_IDS[network]!;
    const t0 = new TokenWrapper(networkId, token0.address, token0.decimals, token0.symbol);
    const t1 = new TokenWrapper(networkId, token1.address, token1.decimals, token1.symbol);
    const pool = new Pool(t0, t1, feeBips, slot.sqrtPriceX96.toString(), liquidity.toString(), Number(slot.tick));
    const pos = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });

    const token0BalanceRaw = pos.amount0.multiply(10 ** token0.decimals).toFixed(0);
    const token1BalanceRaw = pos.amount1.multiply(10 ** token1.decimals).toFixed(0);
    return [token0BalanceRaw, token1BalanceRaw];
  }

  getPositionManager(network: Network) {
    return this.contractFactory.uniswapV3PositionManager({ address: this.managerAddress, network });
  }

  getFactoryContract(network: Network): UniswapV3Factory {
    return this.contractFactory.uniswapV3Factory({ address: this.factoryAddress, network });
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
  }): Promise<UniswapV3Pool> {
    const factoryContract = this.contractFactory.uniswapV3Factory({ address: this.factoryAddress, network });
    const poolAddr = await multicall.wrap(factoryContract).getPool(token0, token1, fee);
    return this.contractFactory.uniswapV3Pool({ address: poolAddr.toLowerCase(), network });
  }

  getERC20(tokenDep: TokenDependency): Erc20 {
    return this.contractFactory.erc20(tokenDep);
  }
}
