import { Injectable } from '@nestjs/common';

import { Network } from '~types';

type BuildContractPositionBalanceFetcherParams = {
  appId: string;
  groupId: string;
  network: Network;
};

@Injectable()
export class DefaultContractPositionBalanceFetcherFactory {
  build(_opts: BuildContractPositionBalanceFetcherParams) {
    const klass = class DefaultContractPositionBalanceFetcher {
      async getBalances(_address: string) {
        return [];
      }
    };

    const instance = new klass();
    return instance;
  }
}
