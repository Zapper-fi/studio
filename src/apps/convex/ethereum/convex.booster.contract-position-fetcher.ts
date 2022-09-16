import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import { ConvexBooster, ConvexContractFactory } from '../contracts';

export const CONVEX_BOOSTERS = ['0xf403c135812408bfbe8713b5a23a04b3d48aae31'];

@PositionTemplate()
export class EthereumConvexBoosterContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ConvexBooster> {
  groupLabel = 'Booster';

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

  async getLabel(): Promise<string> {
    return 'Convex Booster';
  }

  async getTokenBalancesPerPosition() {
    return [];
  }
}
