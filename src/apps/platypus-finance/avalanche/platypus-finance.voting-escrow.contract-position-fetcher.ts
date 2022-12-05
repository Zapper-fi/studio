import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { PlatypusFinanceContractFactory, PlatypusFinanceVotingEscrow } from '../contracts';

@PositionTemplate()
export class AvalanchePlatypusFinanceVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<PlatypusFinanceVotingEscrow> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x5857019c749147eee22b1fe63500f237f3c1b692';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlatypusFinanceContractFactory) protected readonly contractFactory: PlatypusFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): PlatypusFinanceVotingEscrow {
    return this.contractFactory.platypusFinanceVotingEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<PlatypusFinanceVotingEscrow>) {
    return contract.ptp();
  }

  getEscrowedTokenBalance({ address, contract }: GetTokenBalancesParams<PlatypusFinanceVotingEscrow>) {
    return contract.getStakedPtp(address);
  }
}
