import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isLocked } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { CleverContractFactory, CleverVotingEscrow } from '../contracts';

@PositionTemplate()
export class EthereumCleverVotingEscrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CleverVotingEscrow> {
  groupLabel = 'Voting Escrow';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverContractFactory) protected readonly contractFactory: CleverContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CleverVotingEscrow {
    return this.contractFactory.cleverVotingEscrow({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x94be07d45d57c7973a535c1c517bd79e602e051e' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<CleverVotingEscrow>) {
    return [
      {
        metaType: MetaType.LOCKED,
        address: await contract.token(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<CleverVotingEscrow>) {
    const suppliedToken = contractPosition.tokens.find(isLocked)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<CleverVotingEscrow>) {
    const lockedBalance = await contract.locked(address);
    return [lockedBalance.amount];
  }
}
