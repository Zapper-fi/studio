import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';

export type EaseRcaFetcherResponse = {
  symbol: string;
  name: string;
  address: string;
  token: {
    address: string;
    apy: number;
  };
}[];

@Injectable()
export class EaseRcaDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: `studio:ease:ethereum:rca-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getRcaDefinitionsData() {
    const { data } = await Axios.get<EaseRcaFetcherResponse>('https://app.ease.org/api/v1/vaults');

    return data;
  }

  async getRcaDefinitions() {
    const definitionsData = await this.getRcaDefinitionsData();
    const rcaDefinitions = definitionsData.map(rca => {
      return {
        address: rca.address.toLowerCase(),
        underlyingTokenAddress: rca.token.address.toLowerCase(),
      };
    });

    return rcaDefinitions;
  }

  async getRcaApy(rcaAddress: string) {
    const definitionsData = await this.getRcaDefinitionsData();
    const selectedRca = definitionsData.find(x => x.address.toLowerCase() === rcaAddress);

    return selectedRca?.token.apy ?? 0;
  }
}
