import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CURVE_DEFINITION } from '~apps/curve/curve.definition';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { CurveApiClient } from './curve.api.client';
import { REWARDS_ONLY_GAUGES } from './curve.gauge.rewards-only';

export enum CurveGaugeType {
  SINGLE = 'single',
  DOUBLE = 'double',
  N_GAUGE = 'n-gauge',
  GAUGE_V4 = 'gauge-v4',
  REWARDS_ONLY = 'rewards-only',
}

export type CurveGaugeDefinition = {
  version: CurveGaugeType;
  swapAddress: string;
  gaugeAddress: string;
};

@Injectable()
export class CurveGaugeRegistry {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveApiClient) private readonly curveApiClient: CurveApiClient,
  ) {}

  async getGaugesWithType(network: Network): Promise<CurveGaugeDefinition[]> {
    const provider = this.appToolkit.getNetworkProvider(network);
    const gauges = await this.getCachedGauges(network);

    const gaugesWithVersions = await Promise.all(
      gauges.map(async gauge => {
        let bytecode = await provider.getCode(gauge.gaugeAddress);
        const minimalProxyMatch = /0x363d3d373d3d3d363d73(.*)5af43d82803e903d91602b57fd5bf3/.exec(bytecode);
        if (minimalProxyMatch) bytecode = await provider.getCode(`0x${minimalProxyMatch[1]}`);

        const doubleGaugeMethod = ethers.utils.id('rewarded_token()').slice(2, 10);
        const nGaugeMethod = ethers.utils.id('reward_tokens(uint256)').slice(2, 10);
        const gaugeV4Method = ethers.utils.id('reward_data(address)').slice(2, 10);

        if (bytecode.includes(gaugeV4Method)) return { ...gauge, version: CurveGaugeType.GAUGE_V4 };
        if (bytecode.includes(nGaugeMethod)) return { ...gauge, version: CurveGaugeType.N_GAUGE };
        if (bytecode.includes(doubleGaugeMethod)) return { ...gauge, version: CurveGaugeType.DOUBLE };
        return { ...gauge, version: CurveGaugeType.SINGLE };
      }),
    );

    if (network !== Network.ETHEREUM_MAINNET) {
      // Append legacy gauges not found in the API to track their funds
      return [...gaugesWithVersions, ...(REWARDS_ONLY_GAUGES[network] ?? [])];
    }

    return gaugesWithVersions;
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:cached-gauges`,
    ttl: moment.duration(60, 'minutes').asSeconds(),
  })
  async getCachedGauges(network: Network) {
    return this.curveApiClient.getGauges(network);
  }
}
