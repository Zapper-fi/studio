import { Inject } from '@nestjs/common';
import { Token as TokenWrapper } from '@uniswap/sdk-core';
import { Pool, Position, TickMath } from '@uniswap/v3-sdk';
import { AbiEvent } from 'abitype';
import { BigNumberish, BigNumber as EtherBigNumber } from 'ethers';
import {
  RpcLog,
  EstimateGasParameters,
  GetEnsAddressReturnType,
  GetFilterChangesParameters,
  GetTransactionParameters,
  MulticallReturnType,
  WaitForTransactionReceiptParameters,
  WatchEventParameters,
} from 'viem';
import { VerifyTypedDataParameters } from 'viem/_types/actions/public/verifyTypedData';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Token } from '~position/position.interface';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { UniswapV3ViemContractFactory } from '../contracts';
import { UniswapV3Factory, UniswapV3Pool, UniswapV3PositionManager } from '../contracts/viem';
import { UniswapV3FactoryContract } from '../contracts/viem/UniswapV3Factory';
import { UniswapV3PoolContract } from '../contracts/viem/UniswapV3Pool';
import { UniswapV3PositionManagerContract } from '../contracts/viem/UniswapV3PositionManager';

import { AbstractUniswapV3LiquidityContractPositionBuilder } from './uniswap-v3.liquidity.abstract.contract-position-builder';
import {
  UniswapV3LiquidityPositionContractData,
  UniswapV3LiquiditySlotContractData,
  UniswapV3LiquidityTickContractData,
} from './uniswap-v3.liquidity.types';

export class UniswapV3LiquidityContractPositionBuilder extends AbstractUniswapV3LiquidityContractPositionBuilder<
  UniswapV3Pool,
  UniswapV3Factory,
  UniswapV3PositionManager
> {
  managerAddress = '0xc36442b4a4522e871399cd717abdd847ab11fe88';
  factoryAddress = '0x1f98431c8ad98523631ae4a59f267346ea31f984';
  appId = 'uniswap-v3';

  protected MIN_TICK = TickMath.MIN_TICK;
  protected MAX_TICK = TickMath.MAX_TICK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV3ViemContractFactory) protected readonly contractFactory: UniswapV3ViemContractFactory,
  ) {
    super();
  }

  getPositionManager(network: Network): UniswapV3PositionManagerContract {
    return this.contractFactory.uniswapV3PositionManager({ address: this.managerAddress, network });
  }

  getFactoryContract(network: Network): UniswapV3FactoryContract {
    return this.contractFactory.uniswapV3Factory({ address: this.factoryAddress, network });
  }

  getPoolContract(network: Network, address: string): UniswapV3PoolContract {
    return this.contractFactory.uniswapV3Pool({ address: address, network });
  }

  getPoolAddress(contract: UniswapV3FactoryContract, token0: string, token1: string, fee: BigNumberish) {
    return contract.read.getPool([token0, token1, Number(fee)]);
  }

  async getPosition(contract: UniswapV3PositionManagerContract, positionId: BigNumberish) {
    const positionData = await contract.read.positions([BigInt(positionId.toString())]);

    return {
      nonce: positionData[0],
      operator: positionData[1],
      token0: positionData[2],
      token1: positionData[3],
      fee: positionData[4],
      tickLower: positionData[5],
      tickUpper: positionData[6],
      liquidity: positionData[7],
      feeGrowthInside0LastX128: positionData[8],
      feeGrowthInside1LastX128: positionData[9],
      tokensOwed0: positionData[10],
      tokensOwed1: positionData[11],
    };
  }

  async getSlot0(contract: UniswapV3PoolContract): Promise<UniswapV3LiquiditySlotContractData> {
    const slot0Data = await contract.read.slot0();

    return {
      sqrtPriceX96: slot0Data[0],
      tick: slot0Data[1],
      observationIndex: slot0Data[2],
      observationCardinality: slot0Data[3],
      observationCardinalityNext: slot0Data[4],
      feeProtocol: slot0Data[5],
      unlocked: slot0Data[6],
    };
  }

  async getTickSpacing(contract: UniswapV3PoolContract): Promise<BigNumberish> {
    return contract.read.tickSpacing();
  }

  async getLiquidity(contract: UniswapV3PoolContract): Promise<BigNumberish> {
    return contract.read.liquidity();
  }

  async getFeeGrowthGlobal0X128(contract: UniswapV3PoolContract): Promise<BigNumberish> {
    return contract.read.feeGrowthGlobal0X128();
  }

  async getFeeGrowthGlobal1X128(contract: UniswapV3PoolContract): Promise<BigNumberish> {
    return contract.read.feeGrowthGlobal1X128();
  }

  async getTick(contract: UniswapV3PoolContract, tick: BigNumberish): Promise<UniswapV3LiquidityTickContractData> {
    const tickData = await contract.read.ticks([Number(tick)]);

    return {
      liquidityGross: tickData[0],
      liquidityNet: tickData[1],
      feeGrowthOutside0X128: tickData[2],
      feeGrowthOutside1X128: tickData[3],
    };
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
}
