import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import { ConvexBooster, ConvexContractFactory } from '../contracts';

export abstract class ConvexBoosterContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ConvexBooster> {
  abstract boosterAddress: string;

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexBooster {
    return this.contractFactory.convexBooster({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xf403c135812408bfbe8713b5a23a04b3d48aae31' }];
  }

  async getTokenDefinitions() {
    return [];
  }

  async getLabel(): Promise<string> {
    return 'Convex Booster';
  }

  async getTokenBalancesPerPosition() {
    return [];
  }
}
