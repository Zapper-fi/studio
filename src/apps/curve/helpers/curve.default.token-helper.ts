import { Inject, Injectable } from '@nestjs/common';

import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveV1Pool } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

import { CurveOnChainReserveStrategy } from './curve.on-chain.reserve-strategy';
import { CurvePoolTokenHelper } from './curve.pool.token-helper';
import { CurvePoolDefinition } from './pool-token/curve.pool-token.registry';

type CurveDefaultPoolTokenHelperParams = {
  poolDefinitions: CurvePoolDefinition[];
  network: Network;
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class CurveDefaultPoolTokenHelper {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurveOnChainReserveStrategy)
    private readonly curveOnChainReserveStrategy: CurveOnChainReserveStrategy,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
  ) {}

  async getTokens({ network, poolDefinitions, dependencies = [] }: CurveDefaultPoolTokenHelperParams) {
    return this.curvePoolTokenHelper.getTokens<CurveV1Pool>({
      network,
      dependencies,
      poolDefinitions,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.pool.id,
      resolvePoolContract: ({ network, definition }) =>
        this.curveContractFactory.curveV1Pool({ network, address: definition.swapAddress }),
      resolvePoolReserves: this.curveOnChainReserveStrategy.build(),
      resolvePoolVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).get_virtual_price(),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
    });
  }
}
