import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { SpoolV2ViemContractFactory } from '../contracts';
import { SpoolVospool } from '../contracts/viem';

import { VOSPOOL_ADDRESS } from './spool-v2.constants';
@PositionTemplate()
export class EthereumSpoolV2VoSpoolTokenFetcher extends AppTokenTemplatePositionFetcher<SpoolVospool> {
  groupLabel = 'voSPOOL';
  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SpoolV2ViemContractFactory) protected readonly contractFactory: SpoolV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.spoolVospool({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [VOSPOOL_ADDRESS];
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
