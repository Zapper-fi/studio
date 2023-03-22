import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { EscrowThales, ThalesContractFactory } from '../contracts';

export abstract class ThalesEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<EscrowThales> {
  groupLabel = 'Voting Escrow';
  abstract veTokenAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) protected readonly contractFactory: ThalesContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): EscrowThales {
    return this.contractFactory.escrowThales({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<EscrowThales>) {
    return contract.vestingToken();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<EscrowThales>) {
    return contract.totalAccountEscrowedAmount(address);
  }
}
