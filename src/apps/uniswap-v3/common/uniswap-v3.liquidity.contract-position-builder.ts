import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Standard } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';
import { Network } from '~types/network.interface';

import { UniswapV3ContractFactory } from '../contracts';
import { UNISWAP_V3_DEFINITION } from '../uniswap-v3.definition';

import { UniswapV3LiquidityPositionDataProps } from './uniswap-v3.liquidity.contract-position-fetcher';
import { getSupplied, getClaimable, getRange } from './uniswap-v3.liquidity.utils';

type UniswapV3LiquidityContractPositionHelperParams = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
  positionId: BigNumberish;
  network: Network;
};

export class UniswapV3LiquidityContractPositionBuilder {
  managerAddress = '0xc36442b4a4522e871399cd717abdd847ab11fe88';
  factoryAddress = '0x1f98431c8ad98523631ae4a59f267346ea31f984';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV3ContractFactory) protected readonly contractFactory: UniswapV3ContractFactory,
  ) {}

  async buildPosition({ multicall, positionId, tokenLoader, network }: UniswapV3LiquidityContractPositionHelperParams) {
    const positionManager = this.contractFactory.uniswapV3PositionManager({ address: this.managerAddress, network });
    const factoryContract = this.contractFactory.uniswapV3Factory({ address: this.factoryAddress, network });
    const position = await multicall.wrap(positionManager).positions(positionId);

    const fee = position.fee;
    const token0Address = position.token0.toLowerCase();
    const token1Address = position.token1.toLowerCase();
    const queries = [token0Address, token1Address].map(t => ({ address: t, network }));
    const [token0, token1] = await tokenLoader.getMany(queries);
    if (!token0 || !token1) return null;

    const poolAddr = await multicall.wrap(factoryContract).getPool(token0Address, token1Address, fee);
    const poolAddress = poolAddr.toLowerCase();
    const poolContract = this.contractFactory.uniswapV3Pool({ address: poolAddress, network });
    const token0Contract = this.contractFactory.erc20(token0);
    const token1Contract = this.contractFactory.erc20(token1);

    const [slot, liquidity, feeGrowth0, feeGrowth1, ticksLower, ticksUpper, reserveRaw0, reserveRaw1] =
      await Promise.all([
        multicall.wrap(poolContract).slot0(),
        multicall.wrap(poolContract).liquidity(),
        multicall.wrap(poolContract).feeGrowthGlobal0X128(),
        multicall.wrap(poolContract).feeGrowthGlobal1X128(),
        multicall.wrap(poolContract).ticks(Number(position.tickLower)),
        multicall.wrap(poolContract).ticks(Number(position.tickUpper)),
        multicall.wrap(token0Contract).balanceOf(poolAddress),
        multicall.wrap(token1Contract).balanceOf(poolAddress),
      ]);

    // Retrieve underlying reserves, both supplied and claimable
    const range = getRange({ position, slot, token0, token1, network, liquidity });
    const suppliedBalances = getSupplied({ position, slot, token0, token1, network, liquidity });
    const suppliedTokens = [token0, token1].map(v => supplied(v));
    const suppliedTokenBalances = suppliedTokens.map((t, i) => drillBalance(t, suppliedBalances[i]));
    const claimableBalances = getClaimable({ position, slot, ticksLower, ticksUpper, feeGrowth0, feeGrowth1 });
    const claimableTokens = [token0, token1].map(v => claimable(v));
    const claimableTokenBalances = claimableTokens.map((t, i) => drillBalance(t, claimableBalances[i]));

    // Build position price according to underlying reserves
    const tokens = [...suppliedTokenBalances, ...claimableTokenBalances].filter(t => t.balanceUSD > 0.01);
    const balanceUSD = sumBy(tokens, v => v.balanceUSD);

    const reservesRaw = [reserveRaw0, reserveRaw1];
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** suppliedTokens[i].decimals);
    const totalLiquidity = reserves[0] * suppliedTokens[0].price + reserves[1] * suppliedTokens[1].price;

    const dataProps: UniswapV3LiquidityPositionDataProps = {
      feeTier: Number(fee) / 10 ** 4,
      rangeStart: range[0],
      rangeEnd: range[1],
      liquidity: totalLiquidity,
      reserves: reserves,
      poolAddress: poolAddr.toLowerCase(),
      assetStandard: Standard.ERC_721,
    };

    const displayProps = {
      label: `${token0.symbol} / ${token1.symbol} (${range[0]} to ${range[1]})`,
      images: [...getImagesFromToken(token0), ...getImagesFromToken(token1)],
      statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(Number(liquidity)) }],
    };

    const balance: ContractPositionBalance<UniswapV3LiquidityPositionDataProps> = {
      type: ContractType.POSITION,
      address: this.managerAddress,
      appId: UNISWAP_V3_DEFINITION.id,
      groupId: UNISWAP_V3_DEFINITION.groups.liquidity.id,
      network,
      tokens,
      dataProps,
      displayProps,
      balanceUSD,
    };

    return balance;
  }
}
