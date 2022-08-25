import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { RhinoFiContractFactory, RhinoFiBridge } from '../contracts';
import { RHINO_FI_DEFINITION } from '../rhino-fi.definition';

const appId = RHINO_FI_DEFINITION.id;
const groupId = RHINO_FI_DEFINITION.groups.bridge.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumRhinoFiBridgeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RhinoFiBridge> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Bridge';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RhinoFiContractFactory) protected readonly contractFactory: RhinoFiContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RhinoFiBridge {
    return this.contractFactory.rhinoFiBridge({ address, network: this.network });
  }

  async getDescriptors() {
    return [{ address: '0x5d22045daceab03b158031ecb7d9d06fad24609b' }];
  }

  async getTokenDescriptors() {
    return [];
  }

  async getLabel() {
    return `Rhino-Fi Bridge`;
  }

  async getTokenBalancesPerPosition() {
    return [];
  }
}
