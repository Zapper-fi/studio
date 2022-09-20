import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';

type FarmsResponse = {
  farms: {
    depositToken: {
      id: string;
    };
    depositTokenBalance: string;
    id: string;
    name: string;
  }[];
};

const query = gql`
  {
    farms(first: 500) {
      id
      name
      depositToken {
        id
      }
      depositTokenBalance
    }
  }
`;

@Injectable()
export class YieldYakVaultTokenDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:yield-yak:${network}:vault-data`,
    ttl: 5 * 60, // 60 minutes
  })
  async getVaultDefinitionsData() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/yieldyak/reinvest-tracker';
    const data = await this.appToolkit.helpers.theGraphHelper.request<FarmsResponse>({ endpoint, query });
    return data.farms;
  }
}
