import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Performance } from '~apps/hedgefarm/avalanche/hedgefarm.types';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { AlphaTwo, HedgefarmContractFactory } from '../contracts';

@PositionTemplate()
export class AvalancheHedgefarmAlphaTwoTokenFetcher extends AppTokenTemplatePositionFetcher<AlphaTwo> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HedgefarmContractFactory) protected readonly contractFactory: HedgefarmContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AlphaTwo {
    return this.contractFactory.alphaTwo({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x3c390b91fc2f248e75cd271e2dabf7dcc955b1a3'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x152b9d0fdc40c096757f570a51e494bd4b943e50', network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<AlphaTwo>) {
    return [Number(await contract.lastUpdatedPricePerShare()) / 10 ** 8];
  }

  async getApy(_params: GetDataPropsParams<AlphaTwo>) {
    const performance = await this.getPerformance();
    return performance.averageApy;
  }

  @CacheOnInterval({
    key: `studio:hedgefarm:alpha-two:performance`,
    timeout: 15 * 60 * 1000,
    failOnMissingData: false,
  })
  async getPerformance(): Promise<Performance> {
    const url = 'https://api.hedgefarm.workers.dev/alpha2/performance';
    return await Axios.get<Performance>(url).then(v => v.data);
  }
}
