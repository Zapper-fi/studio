import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { BigNumber } from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Cache } from '~cache/cache.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { AmpContractFactory, AmpStaking } from '../contracts';

type DepositedAmpResponse = {
  supplyTotal: string;
  rewardTotal: string;
};

const FARMS = [
  // AMP
  {
    address: '0x706d7f8b3445d8dfc790c524e3990ef014e7c578',
    stakedTokenAddress: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
    rewardTokenAddresses: ['0xff20817765cb7f73d4bde2e66e067e58d11095c2'],
  },
];

@PositionTemplate()
export class EthereumAmpFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<AmpStaking> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConfigService) protected readonly configService: ConfigService,
    @Inject(AmpContractFactory) protected readonly contractFactory: AmpContractFactory,
  ) {
    super(appToolkit);
  }

  @Cache({
    instance: 'business',
    key: (address: string) => `apps-v3:balance:ethereum:amp:api-data:${address}`,
    ttl: 5 * 60, // 5 minutes
  })
  async getApiData(address: string) {
    const axiosInstance = axios.create({
      baseURL: this.configService.get('FLEXA_CAPACITY_API_URL'),
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

  getContract(address: string): AmpStaking {
    return this.contractFactory.ampStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates() {
    return [0];
  }

  async getStakedTokenBalance({ address }: GetTokenBalancesParams<AmpStaking>) {
    // We rely on the API to get staked and claimable balances
    const { supplyTotal, rewardTotal } = await this.getApiData(address);
    return new BigNumber(supplyTotal).plus(rewardTotal).toFixed(0);
  }

  async getRewardTokenBalances() {
    return [0];
  }
}
