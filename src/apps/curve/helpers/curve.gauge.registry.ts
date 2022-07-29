import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CURVE_DEFINITION } from '~apps/curve/curve.definition';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { CurveGaugeDefinition, CurveGaugeType } from '../curve.types';

import { CurveApiClient } from './curve.api.client';

@Injectable()
export class CurveGaugeRegistry {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveApiClient) private readonly curveApiClient: CurveApiClient,
  ) {}

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:gauge-definitions:0`,
    ttl: moment.duration(60, 'minutes').asSeconds(),
  })
  async getGaugeDefinitions(network: Network): Promise<CurveGaugeDefinition[]> {
    const gauges = await this.getCachedGauges(network);

    const gaugesWithVersions = Promise.all(
      gauges.map(async gauge => ({ ...gauge, version: await this.resolveGaugeType(gauge.gaugeAddress, network) })),
    );

    return gaugesWithVersions;
  }

  private async resolveGaugeType(gaugeAddress: string, network: Network) {
    const provider = this.appToolkit.getNetworkProvider(network);
    let bytecode = await provider.getCode(gaugeAddress);
    const minimalProxyMatch = /0x363d3d373d3d3d363d73(.*)5af43d82803e903d91602b57fd5bf3/.exec(bytecode);
    if (minimalProxyMatch) bytecode = await provider.getCode(`0x${minimalProxyMatch[1]}`);

    const doubleGaugeMethod = ethers.utils.id('rewarded_token()').slice(2, 10);
    const nGaugeMethod = ethers.utils.id('reward_tokens(uint256)').slice(2, 10);
    const childGaugeMethod = ethers.utils.id('reward_data(address)').slice(2, 10);
    const gaugeV4Method = ethers.utils.id('claimable_reward_write(address,address)').slice(2, 10);

    if (network !== Network.ETHEREUM_MAINNET) {
      if (bytecode.includes(childGaugeMethod)) return CurveGaugeType.CHILD;
      return CurveGaugeType.REWARDS_ONLY;
    }

    if (bytecode.includes(gaugeV4Method)) return CurveGaugeType.GAUGE_V4;
    if (bytecode.includes(nGaugeMethod)) return CurveGaugeType.N_GAUGE;
    if (bytecode.includes(doubleGaugeMethod)) return CurveGaugeType.DOUBLE;
    return CurveGaugeType.SINGLE;
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:cached-gauges:0`,
    ttl: moment.duration(5, 'minutes').asSeconds(),
  })
  async getCachedGauges(network: Network) {
    return this.curveApiClient.getGauges(network);
  }
}
