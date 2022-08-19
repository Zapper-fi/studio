import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { UniswapV2ContractFactory } from '../contracts';

import { getSupplied, getClaimable, getRange } from './uniswap-v3.liquidity.utils';

type UniswapV3PoolTokenMarketDataHelperParams = {
  positionId: BigNumberish;
  network: Network;
  context?: {
    multicall: IMulticallWrapper;
    baseTokens: BaseToken[];
  };
};

type UniswapV3LiquidityTokenDataProps = {
  rangeStart: number;
  rangeEnd: number;
};

@Injectable()
export class UniswapV3LiquidityTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ContractFactory) protected readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
  ) {}

  async getLiquidityToken({ positionId, network, context }: UniswapV3PoolTokenMarketDataHelperParams) {
    const multicall = context?.multicall ?? this.appToolkit.getMulticall(network);
    const baseTokens = context?.baseTokens ?? (await this.appToolkit.getBaseTokenPrices(network));

    // Set up contracts
    const tokenAddress = '0xc36442b4a4522e871399cd717abdd847ab11fe88';
    const factoryAddress = '0x1f98431c8ad98523631ae4a59f267346ea31f984';
    const positionContract = this.uniswapV2ContractFactory.uniswapV3PositionManager({ address: tokenAddress, network });
    const factoryContract = this.uniswapV2ContractFactory.uniswapV3Factory({ address: factoryAddress, network });

    // Get the position details and token data
    const [position, symbol, supply] = await Promise.all([
      multicall.wrap(positionContract).positions(positionId),
      multicall.wrap(positionContract).symbol(),
      multicall.wrap(positionContract).totalSupply().then(Number),
    ]);

    // Ensure that we support this position by ensuring we have prices for both tokens
    const fee = position.fee;
    const token0Address = position.token0.toLowerCase();
    const token1Address = position.token1.toLowerCase();
    const token0 = baseTokens.find(p => p.address === token0Address);
    const token1 = baseTokens.find(p => p.address === token1Address);
    if (!token0 || !token1) return null;

    // Retrieve on-chain data
    const poolAddr = await multicall.wrap(factoryContract).getPool(token0Address, token1Address, fee);
    const poolAddress = poolAddr.toLowerCase();
    const poolContract = this.uniswapV2ContractFactory.uniswapV3Pool({ address: poolAddress, network });
    const [slot, liquidity, feeGrowth0, feeGrowth1, ticksLower, ticksUpper] = await Promise.all([
      multicall.wrap(poolContract).slot0(),
      multicall.wrap(poolContract).liquidity(),
      multicall.wrap(poolContract).feeGrowthGlobal0X128(),
      multicall.wrap(poolContract).feeGrowthGlobal1X128(),
      multicall.wrap(poolContract).ticks(Number(position.tickLower)),
      multicall.wrap(poolContract).ticks(Number(position.tickUpper)),
    ]);

    // Retrieve underlying reserves, both supplied and claimable
    const range = getRange({ position, slot, token0, token1, network, liquidity });
    const suppliedBalancesRaw = getSupplied({ position, slot, token0, token1, network, liquidity });
    const suppliedTokens = [token0, token1].map(v => supplied(v));
    const suppliedBalances = suppliedBalancesRaw.map((v, i) => Number(v) / 10 ** suppliedTokens[i].decimals);
    const claimableBalancesRaw = getClaimable({ position, slot, ticksLower, ticksUpper, feeGrowth0, feeGrowth1 });
    const claimableTokens = [token0, token1].map(v => claimable(v));
    const claimableBalances = claimableBalancesRaw.map((v, i) => Number(v) / 10 ** claimableTokens[i].decimals);

    // Build position price according to underlying reserves
    const tokens = [...suppliedTokens, ...claimableTokens];
    const balances = [...suppliedBalances, ...claimableBalances];
    const price = sum(balances.map((v, i) => v * tokens[i].price));
    const pricePerShare = [...balances];
    const decimals = 0;

    const dataProps = {
      id: positionId,
      rangeStart: range[0],
      rangeEnd: range[1],
    };

    const displayProps = {
      label: `${token0.symbol} / ${token1.symbol} (${range[0]} to ${range[1]})`,
      images: [getTokenImg(token0.address, network), getTokenImg(token1.address, network)],
      statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(Number(liquidity)) }],
    };

    let token: AppTokenPosition<UniswapV3LiquidityTokenDataProps> = {
      address: tokenAddress,
      type: ContractType.APP_TOKEN,
      appId: 'uniswap-v3',
      groupId: 'liquidity',
      network,
      symbol,
      decimals,
      supply,
      tokens,
      price,
      pricePerShare,
      dataProps,
      displayProps,
    };
    token = {
      ...token,
      key: this.appToolkit.getPositionKey(token, ['id']),
    };
    return token;
  }
}
