import { Injectable } from '@nestjs/common';

import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types';

type BuildContractPositionBalanceFetcherParams = {
  appId: string;
  groupId: string;
  network: Network;
};

@Injectable()
export class DefaultContractPositionBalanceFetcherFactory {
  build(_opts: BuildContractPositionBalanceFetcherParams) {
    const klass = class DefaultContractPositionBalanceFetcher
      implements PositionBalanceFetcher<ContractPositionBalance>
    {
      async getBalances(_address: string) {
        return [];
      }
    };

    const instance = new klass();
    return instance;
  }
}
