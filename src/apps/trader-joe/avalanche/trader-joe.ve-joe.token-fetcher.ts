import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { TraderJoeContractFactory } from '../contracts';
import { TraderJoeVeJoe } from '../contracts/ethers/TraderJoeVeJoe';

@PositionTemplate()
export class AvalancheTraderJoeVeJoeTokenFetcher extends AppTokenTemplatePositionFetcher<TraderJoeVeJoe> {
  groupLabel = 'veJOE';
  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory) protected readonly contractFactory: TraderJoeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.traderJoeVeJoe({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x3cabf341943bc8466245e4d6f1ae0f8d071a1456'];
  }

  async getUnderlyingTokenDefinitions() {
    return [];
  }

  async getPricePerShare() {
    return [1];
  }

  async getPrice() {
    return 0; // Valueless token
  }
}
