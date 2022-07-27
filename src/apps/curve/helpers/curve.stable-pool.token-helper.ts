import { Inject, Injectable } from '@nestjs/common';
import { partition } from 'lodash';

import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveV1Pool } from '../contracts';

import { CurveOnChainReserveStrategy } from './curve.on-chain.reserve-strategy';
import { CurvePoolTokenHelper } from './curve.pool.token-helper';
import { CurvePoolDefinition } from './registry/curve.on-chain.registry';

type CurveDefaultPoolTokenHelperParams = {
  poolDefinitions: CurvePoolDefinition[];
  network: Network;
  appId: string;
  groupId: string;
  dependencies?: AppGroupsDefinition[];
  baseCurveTokens?: AppTokenPosition[];
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

  private async _getTokens({
    network,
    appId,
    groupId,
    poolDefinitions,
    baseCurveTokens = [],
    dependencies = [],
  }: CurveDefaultPoolTokenHelperParams) {
    return this.curvePoolTokenHelper.getTokens<CurveV1Pool>({
      network: network,
      appId: appId,
      groupId: groupId,
      dependencies,
      baseCurveTokens,
      resolvePoolDefinitions: async () => poolDefinitions,
      resolvePoolContract: ({ network, definition }) =>
        this.curveContractFactory.curveV1Pool({ network, address: definition.swapAddress }),
      resolvePoolReserves: this.curveOnChainReserveStrategy.build(),
      resolvePoolVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).get_virtual_price(),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
    });
  }

  async getTokens(params: CurveDefaultPoolTokenHelperParams) {
    const [basePoolDefinitions, metaPoolDefinitions] = partition(params.poolDefinitions, v => !v.isMetaPool);
    const baseCurveTokens = await this._getTokens({ ...params, poolDefinitions: basePoolDefinitions });
    const metaCurveTokens = await this._getTokens({ ...params, poolDefinitions: metaPoolDefinitions, baseCurveTokens });
    return [...baseCurveTokens, ...metaCurveTokens];
  }
}
