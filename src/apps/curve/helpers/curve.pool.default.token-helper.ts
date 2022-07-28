import { Inject, Injectable } from '@nestjs/common';

import { CurvePool } from '~apps/curve/contracts/ethers/CurvePool';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

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
    @Inject(CurvePoolVirtualPriceStrategy)
    private readonly curvePoolVirtualPriceStrategy: CurvePoolVirtualPriceStrategy,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurvePoolRegistry)
    private readonly curvePoolRegistry: CurvePoolRegistry,
  ) {}

  async getTokens({ network, dependencies = [] }: CurvePoolDefaultTokenHelperParams) {
    return this.curvePoolTokenHelper.getTokens<CurvePool>({
      network,
      dependencies,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.pool.id,
      poolDefinitions: await this.curvePoolRegistry.getPoolDefinitions(network),
      minLiquidity: 1000,
      resolvePoolContract: ({ network, definition }) =>
        this.curveContractFactory.curvePool({ network, address: definition.swapAddress }),
      resolvePoolReserves: ({ coinAddresses, multicall, poolContract }) =>
        Promise.all(coinAddresses.map((_, i) => multicall.wrap(poolContract).balances(i))),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
      resolvePoolTokenPrice: this.curvePoolVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).get_virtual_price(),
      }),
    });
  }
}
