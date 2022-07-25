import { Inject, Injectable } from '@nestjs/common';

import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveV2Pool } from '../contracts';
import { CurvePoolDefinition } from '../curve.types';

import { CurveApiVolumeStrategy } from './curve.api.volume-strategy';
import { CurveLiquidityAndVirtualPriceStrategy } from './curve.liquidity-and-virtual.price-strategy';
import { CurveOnChainCoinStrategy } from './curve.on-chain.coin-strategy';
import { CurveOnChainReserveStrategy } from './curve.on-chain.reserve-strategy';
import { CurvePoolTokenHelper } from './curve.pool.token-helper';

type CurveCryptoPoolTokenHelperParams = {
  network: Network;
  appId: string;
  groupId: string;
  statsUrl?: string;
  appTokenDependencies?: AppGroupsDefinition[];
  poolDefinitions: CurvePoolDefinition[];
  baseCurveTokens?: AppTokenPosition[];
};

@Injectable()
export class CurveCryptoPoolTokenHelper {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurveOnChainCoinStrategy)
    private readonly curveOnChainCoinStrategy: CurveOnChainCoinStrategy,
    @Inject(CurveOnChainReserveStrategy)
    private readonly curveOnChainReserveStrategy: CurveOnChainReserveStrategy,
    @Inject(CurveApiVolumeStrategy)
    private readonly curveApiVolumeStrategy: CurveApiVolumeStrategy,
    @Inject(CurveLiquidityAndVirtualPriceStrategy)
    private readonly curveLiquidityAndVirtualPriceStrategy: CurveLiquidityAndVirtualPriceStrategy,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
  ) {}

  async getTokens({
    network,
    appId,
    groupId,
    poolDefinitions,
    statsUrl = '',
    baseCurveTokens = [],
    appTokenDependencies = [],
  }: CurveCryptoPoolTokenHelperParams) {
    return this.curvePoolTokenHelper.getTokens<CurveV2Pool>({
      network,
      appId,
      groupId,
      appTokenDependencies,
      baseCurveTokens,
      resolvePoolDefinitions: async () => poolDefinitions,
      resolvePoolContract: ({ network, definition }) =>
        this.curveContractFactory.curveV2Pool({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.curveContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses: this.curveOnChainCoinStrategy.build(),
      resolvePoolReserves: this.curveOnChainReserveStrategy.build(),
      resolvePoolVolume: this.curveApiVolumeStrategy.build({ statsUrl }),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
      resolvePoolTokenPrice: this.curveLiquidityAndVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) =>
          multicall
            .wrap(poolContract)
            .get_virtual_price()
            .catch(() => 0),
      }),
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
    });
  }
}
