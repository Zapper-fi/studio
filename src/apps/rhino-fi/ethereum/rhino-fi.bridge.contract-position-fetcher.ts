import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import { RhinoFiViemContractFactory } from '../contracts';
import { RhinoFiBridge } from '../contracts/viem';

@PositionTemplate()
export class EthereumRhinoFiBridgeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RhinoFiBridge> {
  groupLabel = 'Bridge';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RhinoFiViemContractFactory) protected readonly contractFactory: RhinoFiViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
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
