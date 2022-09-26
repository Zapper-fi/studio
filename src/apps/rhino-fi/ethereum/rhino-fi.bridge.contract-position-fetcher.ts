import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import { RhinoFiContractFactory, RhinoFiBridge } from '../contracts';

@PositionTemplate()
export class EthereumRhinoFiBridgeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RhinoFiBridge> {
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

  async getDefinitions() {
    return [{ address: '0x5d22045daceab03b158031ecb7d9d06fad24609b' }];
  }

  async getTokenDefinitions() {
    return [];
  }

  async getLabel() {
    return `Rhino-Fi Bridge`;
  }

  async getTokenBalancesPerPosition() {
    return [];
  }
}
