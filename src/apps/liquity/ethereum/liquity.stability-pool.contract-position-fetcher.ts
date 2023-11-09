import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { LiquityViemContractFactory } from '../contracts';
import { StabilityPool } from '../contracts/viem';

@PositionTemplate()
export class EthereumLiquityStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StabilityPool> {
  groupLabel = 'Stability Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LiquityViemContractFactory) protected readonly contractFactory: LiquityViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stabilityPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x66017d22b0f8556afdd19fc67041899eb65a21bb' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0', // LUSD
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: ZERO_ADDRESS, // ETH
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d', // LQTY
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<StabilityPool>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Stability Pool`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<StabilityPool>) {
    return Promise.all([
      contract.read.getCompoundedLUSDDeposit([address]),
      contract.read.getDepositorETHGain([address]),
      contract.read.getDepositorLQTYGain([address]),
    ]);
  }
}
