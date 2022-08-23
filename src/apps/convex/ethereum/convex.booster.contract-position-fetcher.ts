import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { ConvexBooster, ConvexContractFactory } from '../contracts';
import { CONVEX_DEFINITION } from '../convex.definition';

export const CONVEX_BOOSTERS = ['0xf403c135812408bfbe8713b5a23a04b3d48aae31'];

const appId = CONVEX_DEFINITION.id;
const groupId = CONVEX_DEFINITION.groups.booster.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumConvexBoosterContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ConvexBooster> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Booster';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexBooster {
    return this.contractFactory.convexBooster({ address, network: this.network });
  }

  async getDescriptors() {
    return [{ address: '0xf403c135812408bfbe8713b5a23a04b3d48aae31' }];
  }

  async getLabel(): Promise<string> {
    return 'Convex Booster';
  }

  async getTokenBalancesPerPosition() {
    return [];
  }
}
