import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { CleverContractFactory, CleverGaugeController } from '../contracts';

import { CLEV } from './addresses';

@PositionTemplate()
export class EthereumCleverFarmingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CleverGaugeController> {
  groupLabel = 'Farming';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverContractFactory) protected readonly contractFactory: CleverContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CleverGaugeController {
    return this.contractFactory.cleverGaugeController({ address, network: this.network });
  }

  getGauges(): string[] {
    return ['0xc5022291ca8281745d173bb855dcd34dda67f2f0', '0x86e917ad6cb44f9e6c8d9fa012acf0d0cfcf114f'];
  }

  async getDefinitions() {
    return [{ address: '0xb992e8e1943f40f89301ab89a5c254f567af5b63' }];
  }

  async getTokenDefinitions() {
    const tokens = this.getGauges().map(async x => ({
      metaType: MetaType.SUPPLIED,
      address: await this.contractFactory.cleverGauge({ address: x, network: this.network }).lp_token(),
      network: this.network,
    }));

    return Promise.all([
      ...tokens,
      {
        metaType: MetaType.CLAIMABLE,
        address: CLEV,
        network: this.network,
      },
    ]);
  }

  async getLabel() {
    return `Clever Farming`;
  }

  async getTokenBalancesPerPosition({ address }: GetTokenBalancesParams<CleverGaugeController>) {
    const positions = this.getGauges().map(x =>
      this.contractFactory.cleverGauge({ address: x, network: this.network }).balanceOf(address),
    );
    const claimable = this.getGauges()
      .map(x => this.contractFactory.cleverGauge({ address: x, network: this.network }).claimable_tokens(address))
      .reduce((claimable, current) => claimable.then(async x => x.add(await current)));

    return Promise.all([...positions, claimable]);
  }
}
