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
import { TroveManager } from '../contracts/viem';

@PositionTemplate()
export class EthereumLiquityTroveContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TroveManager> {
  groupLabel = 'Trove';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LiquityViemContractFactory) protected readonly contractFactory: LiquityViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.troveManager({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xa39739ef8b0231dbfa0dcda07d7e29faabcf4bb2' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: ZERO_ADDRESS, // ETH
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0', // LUSD
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<TroveManager>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Trove`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<TroveManager>) {
    return Promise.all([contract.read.getTroveColl([address]), contract.read.getTroveDebt([address])]);
  }
}
