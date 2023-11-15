import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { ArthViemContractFactory } from '../contracts';
import { TroveManager } from '../contracts/viem';

@PositionTemplate()
export class EthereumArthTroveContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TroveManager> {
  groupLabel = 'Loan';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArthViemContractFactory) protected readonly contractFactory: ArthViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.troveManager({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x8b1da95724b1e376ae49fdb67afe33fe41093af5' }];
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
        address: '0x8cc0f052fff7ead7f2edcccac895502e884a8a71', // ARTH
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<TroveManager>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Loan`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<TroveManager>) {
    return Promise.all([contract.read.getTroveColl([address]), contract.read.getTroveDebt([address])]);
  }
}
