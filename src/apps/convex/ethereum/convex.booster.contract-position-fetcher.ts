import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { ConvexBooster, ConvexContractFactory } from '../contracts';
import { CONVEX_DEFINITION } from '../convex.definition';

export const CONVEX_BOOSTERS = ['0xf403c135812408bfbe8713b5a23a04b3d48aae31'];

@Injectable()
export class EthereumConvexBoosterContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ConvexBooster> {
  appId = CONVEX_DEFINITION.id;
  groupId = CONVEX_DEFINITION.groups.booster.id;
  network = Network.ETHEREUM_MAINNET;
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
