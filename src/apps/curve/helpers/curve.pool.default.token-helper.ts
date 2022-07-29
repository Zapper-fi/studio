import { Inject, Injectable } from '@nestjs/common';

import { CurvePool } from '~apps/curve/contracts/ethers/CurvePool';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurvePoolLegacy } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

import { CurvePoolOnChainCoinStrategy } from './curve.pool.on-chain.coin-strategy';
import { CurvePoolOnChainReserveStrategy } from './curve.pool.on-chain.reserve-strategy';
import { CurvePoolRegistry } from './curve.pool.registry';
import { CurvePoolTokenHelper } from './curve.pool.token-helper';
import { CurvePoolVirtualPriceStrategy } from './curve.pool.virtual.price-strategy';

type CurvePoolDefaultTokenHelperParams = {
  network: Network;
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class CurvePoolDefaultTokenHelper {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurvePoolOnChainCoinStrategy)
    private readonly curvePoolOnChainCoinStrategy: CurvePoolOnChainCoinStrategy,
    @Inject(CurvePoolOnChainReserveStrategy)
    private readonly curvePoolOnChainReserveStrategy: CurvePoolOnChainReserveStrategy,
    @Inject(CurvePoolVirtualPriceStrategy)
    private readonly curvePoolVirtualPriceStrategy: CurvePoolVirtualPriceStrategy,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurvePoolRegistry)
    private readonly curvePoolRegistry: CurvePoolRegistry,
  ) {}

  async getTokens({ network, dependencies = [] }: CurvePoolDefaultTokenHelperParams) {
    const poolDefinitions = await this.curvePoolRegistry.getPoolDefinitions(network);
    const legacy = poolDefinitions.filter(v => v.isLegacy).map(v => v.swapAddress);

    return this.curvePoolTokenHelper.getTokens<CurvePool | CurvePoolLegacy>({
      network,
      dependencies,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.pool.id,
      poolDefinitions: poolDefinitions,
      minLiquidity: 1000,
      resolvePoolContract: ({ network, address }) =>
        legacy.includes(address)
          ? this.curveContractFactory.curvePoolLegacy({ address, network })
          : this.curveContractFactory.curvePool({ address, network }),
      resolvePoolCoinAddresses: this.curvePoolOnChainCoinStrategy.build({
        resolveCoinAddress: ({ poolContract, multicall, index }) => multicall.wrap(poolContract).coins(index),
      }),
      resolvePoolReserves: this.curvePoolOnChainReserveStrategy.build({
        resolveReserve: ({ poolContract, multicall, index }) => multicall.wrap(poolContract).balances(index),
      }),
      resolvePoolTokenPrice: this.curvePoolVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).get_virtual_price(),
      }),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
    });
  }
}
