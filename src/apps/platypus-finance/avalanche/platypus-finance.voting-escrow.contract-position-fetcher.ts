import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PlatypusFinanceContractFactory, PlatypusFinanceVotingEscrow } from '../contracts';
import { PLATYPUS_FINANCE_DEFINITION } from '../platypus-finance.definition';

@Injectable()
export class AvalanchePlatypusFinanceVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<PlatypusFinanceVotingEscrow> {
  appId = PLATYPUS_FINANCE_DEFINITION.id;
  groupId = PLATYPUS_FINANCE_DEFINITION.groups.votingEscrow.id;
  network = Network.AVALANCHE_MAINNET;
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
