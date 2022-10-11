import { Token as KsToken } from '@kyberswap/ks-sdk-core';
import { Pool, Position } from '@kyberswap/ks-sdk-elastic';

import { Token } from '~position/position.interface';
import { Network, NETWORK_IDS } from '~types';

import { KyberElasticLiquidityPositionContractData, KyberElasticPoolStateData } from './kyber-elastic.liquidity.types';

export const getSupplied = ({
  position,
  state,
  token0,
  token1,
  network,
}: {
  position: KyberElasticLiquidityPositionContractData;
  state: KyberElasticPoolStateData;
  token0: Token;
  token1: Token;
  network: Network;
}) => {
  const tickLower = Number(position.tickLower);
  const tickUpper = Number(position.tickUpper);
  const feeBips = Number(position.fee);

  const networkId = NETWORK_IDS[network]!;
  const t0 = new KsToken(networkId, token0.address, token0.decimals, token0.symbol);
  const t1 = new KsToken(networkId, token1.address, token1.decimals, token1.symbol);
  const pool = new Pool(t0, t1, feeBips, state.sqrtPriceX96, state.liquidity, state.reinvestL, state.currentTick);
  const pos = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });

  const token0BalanceRaw = pos.amount0.multiply(10 ** token0.decimals).toFixed(0);
  const token1BalanceRaw = pos.amount1.multiply(10 ** token1.decimals).toFixed(0);
  return [token0BalanceRaw, token1BalanceRaw];
};

export const getRange = ({
  position,
  state,
  token0,
  token1,
  network,
}: {
  position: KyberElasticLiquidityPositionContractData;
  state: KyberElasticPoolStateData;
  token0: Token;
  token1: Token;
  network: Network;
}) => {
  const sqrtPriceX96 = state.sqrtPriceX96; // sqrt(token1/token0) Q64.96 value
  const tickCurrent = state.currentTick;

  const tickLower = Number(position.tickLower);
  const tickUpper = Number(position.tickUpper);
  const feeBips = Number(position.fee);

  const networkId = NETWORK_IDS[network]!;
  const t0Wrapper = new KsToken(networkId, token0.address, token0.decimals, token0.symbol);
  const t1Wrapper = new KsToken(networkId, token1.address, token1.decimals, token1.symbol);
  const pool = new Pool(
    t0Wrapper,
    t1Wrapper,
    feeBips,
    sqrtPriceX96.toString(),
    state.liquidity,
    state.reinvestL.toString(),
    tickCurrent,
  );
  const positionZ = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });
  const positionLowerBound = Number(positionZ.token0PriceLower.toFixed(4));
  const positionUpperBound = Number(positionZ.token0PriceUpper.toFixed(4));
  return [positionLowerBound, positionUpperBound];
};
