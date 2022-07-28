import { Inject, Injectable } from '@nestjs/common';

import { CurvePool } from '~apps/curve/contracts/ethers/CurvePool';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

import { CurvePoolRegistry } from './curve.pool.registry';
import { CurvePoolReserveStrategy } from './curve.pool.reserve-strategy';
import { CurvePoolTokenHelper } from './curve.pool.token-helper';

type CurvePoolDefaultTokenHelperParams = {
  network: Network;
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class CurvePoolDefaultTokenHelper {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurvePoolReserveStrategy)
    private readonly curveOnChainReserveStrategy: CurvePoolReserveStrategy,
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
      resolvePoolContract: ({ network, definition }) =>
        this.curveContractFactory.curvePool({ network, address: definition.swapAddress }),
      resolvePoolReserves: this.curveOnChainReserveStrategy.build(),
      resolvePoolVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).get_virtual_price(),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
    });
  }
}
