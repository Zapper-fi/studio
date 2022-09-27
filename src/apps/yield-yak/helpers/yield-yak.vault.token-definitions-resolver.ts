import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import Axios from 'axios';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';
import { YieldYakContractFactory } from '../contracts';

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
    farms(first: 1000) {
      id
      name
      depositToken {
        id
      }
      depositTokenBalance
    }
  }
`;

export type YieldYakFarmDetails = {
  address: string;
  deployed: number;
  name: string;
  depositToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  totalDeposits: string;
};

@Injectable()
export class YieldYakVaultTokenDefinitionsResolver {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldYakContractFactory) private readonly yieldyakContractFactory: YieldYakContractFactory,
  ) {}

  @Cache({
    key: network => `studio:yield-yak:${network}:vault-data`,
    ttl: 5 * 60, // 60 minutes
  })
  async getVaultDefinitionsData(network: Network): Promise<FarmsResponse['farms']> {
    const farms = await Axios.get<YieldYakFarmDetails[]>('https://staging-api.yieldyak.com/farms').then(x => x.data);
    const multicall = this.appToolkit.getMulticall(network);

    const response = await Promise.all(
      farms.map(async farm => {
        const farmContract = this.yieldyakContractFactory.yieldYakVault({
          address: farm.address,
          network: Network.AVALANCHE_MAINNET,
        });

        try {
          const [depositTokenBalance, name, depositToken] = await Promise.all([
            multicall.wrap(farmContract).totalDeposits(),
            multicall.wrap(farmContract).name(),
            multicall.wrap(farmContract).depositToken(),
          ]);

          return {
            depositToken: {
              id: depositToken,
            },
            depositTokenBalance: depositTokenBalance.toString(),
            id: farm.address.toLowerCase(),
            name,
          };
        } catch (err) {
          // console.log('error occurred', farm, err);
          return null;
        }
      }),
    );

    return _.compact(response);
  }
}
