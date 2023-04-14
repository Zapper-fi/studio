import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

type DopexSsovV3Response = Record<string, DopexSsovV3>;

type DopexSsovV3 = {
  address: string;
}[];

@Injectable()
export class DopexSsovV3DefinitionsResolver {
  @Cache({
    key: _network => `studio:dopex:ssov-v3:definition-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getSsovV3DefinitionsData() {
    const { data } = await Axios.get<DopexSsovV3Response>(`https://api.dopex.io/v2/ssov`);
    return data;
  }

  async getSsovV3Definitions(network: Network) {
    const definitionsDataRaw = await this.getSsovV3DefinitionsData();
    const networkId = NETWORK_IDS[network]!;

    return definitionsDataRaw[networkId].map(ssov => ssov.address.toLowerCase());
  }
}
