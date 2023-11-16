import { Inject } from '@nestjs/common';
import { Token as PancakeSwapToken } from '@pancakeswap/swap-sdk-core';
import { Pool, Position, TickMath } from '@pancakeswap/v3-sdk';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AbstractUniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.abstract.contract-position-builder';
import {
  UniswapV3LiquidityPositionContractData,
  UniswapV3LiquiditySlotContractData,
  UniswapV3LiquidityTickContractData,
} from '~apps/uniswap-v3/common/uniswap-v3.liquidity.types';
import { Token } from '~position/position.interface';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { PancakeswapV3ViemContractFactory } from '../contracts';
import { PancakeswapFactory, PancakeswapNfPositionManager, PancakeswapPool } from '../contracts/viem';
import { PancakeswapFactoryContract } from '../contracts/viem/PancakeswapFactory';
import { PancakeswapNfPositionManagerContract } from '../contracts/viem/PancakeswapNfPositionManager';
import { PancakeswapPoolContract } from '../contracts/viem/PancakeswapPool';

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
    @Inject(PancakeswapV3ViemContractFactory) protected readonly contractFactory: PancakeswapV3ViemContractFactory,
  ) {
    super();
  }

  getPositionManager(network: Network): PancakeswapNfPositionManagerContract {
    return this.contractFactory.pancakeswapNfPositionManager({ address: this.managerAddress, network });
  }

  getFactoryContract(network: Network): PancakeswapFactoryContract {
    return this.contractFactory.pancakeswapFactory({ address: this.factoryAddress, network });
  }

  getPoolContract(network: Network, address: string): PancakeswapPoolContract {
    return this.contractFactory.pancakeswapPool({ address: address, network });
  }

  getPoolAddress(contract: PancakeswapFactoryContract, token0: string, token1: string, fee: BigNumberish) {
    return contract.read.getPool([token0, token1, Number(fee)]);
  }

  async getPosition(contract: PancakeswapNfPositionManagerContract, positionId: BigNumberish) {
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

  async getSlot0(contract: PancakeswapPoolContract): Promise<UniswapV3LiquiditySlotContractData> {
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

  async getTickSpacing(contract: PancakeswapPoolContract): Promise<BigNumberish> {
    return contract.read.tickSpacing();
  }

  async getLiquidity(contract: PancakeswapPoolContract): Promise<BigNumberish> {
    return contract.read.liquidity();
  }

  async getFeeGrowthGlobal0X128(contract: PancakeswapPoolContract): Promise<BigNumberish> {
    return contract.read.feeGrowthGlobal0X128();
  }

  async getFeeGrowthGlobal1X128(contract: PancakeswapPoolContract): Promise<BigNumberish> {
    return contract.read.feeGrowthGlobal1X128();
  }

  async getTick(contract: PancakeswapPoolContract, tick: BigNumberish): Promise<UniswapV3LiquidityTickContractData> {
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
}
