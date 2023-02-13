import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { CleverContractFactory, CleverFurnace, CleverGaugeController } from '../contracts';

import { CVX, CLEVCVX, CLEV } from './addresses';

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

  getGauges() : string[] {
    return [
    '0xc5022291cA8281745d173bB855DCd34dda67F2f0',
    '0x86e917ad6Cb44F9E6C8D9fA012acF0d0CfcF114f',
    ]
  }

  async getDefinitions() {
    return [{ address: '0xB992E8E1943f40f89301aB89A5C254F567aF5b63' }];
  } 

  async getTokenDefinitions() {
    const tokens = this.getGauges().map(async x => (
      {
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

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<CleverGaugeController>) {
    
    const positions = this.getGauges().map(x => this.contractFactory.cleverGauge({ address: x, network: this.network }).balanceOf(address));
    const claimable = this.getGauges().map(x => this.contractFactory.cleverGauge({ address: x, network: this.network }).claimable_tokens(address))
      .reduce((claimable, current) =>  claimable.then(async x => x.add(await current)));

    return Promise.all([...positions, claimable]);
  }
}
