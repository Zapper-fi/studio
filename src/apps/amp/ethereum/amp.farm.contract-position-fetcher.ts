import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { BigNumberish } from 'ethers';
import { sortBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Cache } from '~cache/cache.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { AmpContractFactory, AmpStaking } from '../contracts';

type DepositedAmpResponse = {
  supplyTotal: string;
  rewardTotal: string;
};

@PositionTemplate()
export class EthereumAmpFarmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AmpStaking> {
  groupLabel = 'Flexa Capacity';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConfigService) protected readonly configService: ConfigService,
    @Inject(AmpContractFactory) protected readonly contractFactory: AmpContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x706d7f8b3445d8dfc790c524e3990ef014e7c578' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
        network: this.network,
      },
      //add second position to represent earned rewards that are not claimable and auto compounded
      //we do not want claimable label on front end, using LOCKED for now
      {
        metaType: MetaType.LOCKED,
        address: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
        network: this.network,
        symbol: 'AMP Rewards',
      },
    ];
  }

  getContract(address: string): AmpStaking {
    return this.contractFactory.ampStaking({ address, network: this.network });
  }
  @Cache({
    instance: 'business',
    key: (address: string) => `apps-v3:balance:ethereum:amp:api-data:${address}`,
    ttl: 15 * 60, // 15 minutes
  })
  async getAddressBalances(address: string) {
    const axiosInstance = axios.create({
      baseURL: 'https://api.capacity.production.flexa.network',
      headers: {
        Accept: 'application/vnd.flexa.capacity.v1+json',
      },
    });
    return axiosInstance
      .get<DepositedAmpResponse>(`/accounts/${address}/totals`)
      .then(({ data }) => data)
      .catch(err => {
        if ((err as AxiosError).response?.data.error === 'Address not found')
          return { supplyTotal: '0', rewardTotal: '0' } as DepositedAmpResponse;
        throw err;
      });
  }

  async getTokenBalancesPerPosition({ address }: GetTokenBalancesParams<AmpStaking>): Promise<BigNumberish[]> {
    const { supplyTotal, rewardTotal } = await this.getAddressBalances(address);
    return rewardTotal > supplyTotal ? [] : [supplyTotal, rewardTotal];
  }
  @Cache({
    instance: 'business',
    key: () => `apps-v3:balance:ethereum:amp:api-data`,
    ttl: 15 * 60, // 15 minutes
  })
  async getPoolApys() {
    const capacityResponse = axios.create({
      baseURL: 'https://api.capacity.production.flexa.network',
      headers: {
        Accept: 'application/vnd.flexa.capacity.v1+json',
      },
    });
    return capacityResponse
      .get('/apps')
      .then(function (response) {
        let apyRangeLabel;
        const data = response.data;
        if (data.apps) {
          for (const i in data.apps) {
            data.apps[i].numApy = Number(data.apps[i].apy);
          }
          const sortedApps = sortBy(data.apps, 'numApy');
          const lowestApy = sortedApps[0].apy === '0' ? sortedApps[1].apy : sortedApps[0].apy;
          const highestApy = sortedApps[sortedApps.length - 1].apy;
          apyRangeLabel = 'Staked Amp (' + highestApy + '% to ' + lowestApy + '% APY)';
        } else {
          apyRangeLabel = 'Staked Amp';
        }
        return apyRangeLabel;
      })
      .catch(function () {
        return 'Staked Amp';
      });
  }

  async getLabel() {
    return await this.getPoolApys();
  }
}
