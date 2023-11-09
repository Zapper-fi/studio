import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { ArthViemContractFactory } from '../contracts';
import { StabilityPool } from '../contracts/viem';

@PositionTemplate()
export class EthereumArthStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StabilityPool> {
  groupLabel = 'Stability Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArthViemContractFactory) protected readonly contractFactory: ArthViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stabilityPool({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x910f16455e5eb4605fe639e2846579c228eed3b5' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x8cc0f052fff7ead7f2edcccac895502e884a8a71', // ARTH
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: ZERO_ADDRESS, // ETH
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x745407c86df8db893011912d3ab28e68b62e49b0', // MAHA
        network: this.network,
      },
    ];
  }

  async getLabel(): Promise<string> {
    return `ARTH Stability Pool`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<StabilityPool, DefaultDataProps>) {
    return Promise.all([
      contract.read.getCompoundedARTHDeposit([address]),
      contract.read.getDepositorETHGain([address]),
      contract.read.getDepositorMAHAGain([address]),
    ]);
  }
}
