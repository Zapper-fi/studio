import { Inject, Injectable } from '@nestjs/common';

import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveFactoryPool } from '../contracts';

import { CurveFactoryPoolDefinitionStrategy } from './curve.factory.pool-definition-strategy';
import { CurveOnChainCoinStrategy } from './curve.on-chain.coin-strategy';
import { CurveOnChainReserveStrategy } from './curve.on-chain.reserve-strategy';
import { CurveOnChainVolumeStrategy } from './curve.on-chain.volume-strategy';
import { CurvePoolTokenHelper } from './curve.pool.token-helper';
import { CurveVirtualPriceStrategy } from './curve.virtual.price-strategy';

type CurveFactoryPoolTokenHelperParams = {
  factoryAddress: string;
  network: Network;
  appId: string;
  groupId: string;
  appTokenDependencies?: AppGroupsDefinition[];
  baseCurveTokens?: AppTokenPosition[];
  skipVolume?: boolean;
};

@Injectable()
export class CurveFactoryPoolTokenHelper {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurveOnChainCoinStrategy)
    private readonly curveOnChainCoinStrategy: CurveOnChainCoinStrategy,
    @Inject(CurveOnChainReserveStrategy)
    private readonly curveOnChainReserveStrategy: CurveOnChainReserveStrategy,
    @Inject(CurveFactoryPoolDefinitionStrategy)
    private readonly curveFactoryPoolDefinitionStrategy: CurveFactoryPoolDefinitionStrategy,
    @Inject(CurveVirtualPriceStrategy)
    private readonly curveVirtualPriceStrategy: CurveVirtualPriceStrategy,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveOnChainVolumeStrategy)
    private readonly curveOnChainVolumeStrategy: CurveOnChainVolumeStrategy,
  ) {}

  async getTokens({
    factoryAddress,
    network,
    appId,
    groupId,
    appTokenDependencies = [],
    baseCurveTokens = [],
    skipVolume = false,
  }: CurveFactoryPoolTokenHelperParams) {
    return this.curvePoolTokenHelper.getTokens<CurveFactoryPool>({
      network,
      appId,
      groupId,
      baseCurveTokens,
      appTokenDependencies,
      minLiquidity: 100_000,
      resolvePoolDefinitions: this.curveFactoryPoolDefinitionStrategy.build({ address: factoryAddress }),
      resolvePoolContract: ({ network, definition }) =>
        this.curveContractFactory.curveFactoryPool({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.curveContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses: this.curveOnChainCoinStrategy.build(),
      resolvePoolReserves: this.curveOnChainReserveStrategy.build(),
      resolvePoolVolume: skipVolume ? undefined : this.curveOnChainVolumeStrategy.build({ includeUnderlying: true }),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
      resolvePoolTokenPrice: this.curveVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) =>
          multicall
            .wrap(poolContract)
            .get_virtual_price()
            .catch(() => '0'),
      }),
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
    });
  }
}
