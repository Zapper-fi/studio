import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Performance } from '~apps/hedgefarm/avalanche/hedgefarm.types';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { AlphaOne, HedgefarmContractFactory } from '../contracts';

@PositionTemplate()
export class AvalancheHedgefarmAlphaOneTokenFetcher extends AppTokenTemplatePositionFetcher<AlphaOne> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HedgefarmContractFactory) protected readonly contractFactory: HedgefarmContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AlphaOne {
    return this.contractFactory.alphaOne({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xde4133f0cfa1a61ba94ec64b6fede4acc1fe929e'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<AlphaOne>) {
    return [Number(await contract.pricePerShare()) / 10 ** 6];
  }

  async getApy(_params: GetDataPropsParams<AlphaOne>) {
    const performance = await this.getPerformance();
    return performance.averageApy;
  }

  @CacheOnInterval({
    key: `studio:hedgefarm:alpha-one:performance`,
    timeout: 15 * 60 * 1000,
    failOnMissingData: false,
  })
  async getPerformance(): Promise<Performance> {
    const url = 'https://api.hedgefarm.workers.dev/alpha1/performance';
    return await Axios.get<Performance>(url).then(v => v.data);
  }
}
