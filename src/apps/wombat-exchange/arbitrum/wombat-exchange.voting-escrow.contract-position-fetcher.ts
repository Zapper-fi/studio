import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { WombatExchangeContractFactory, WombatExchangeVotingEscrow } from '../contracts';

@PositionTemplate()
export class ArbitrumWombatExchangeVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<WombatExchangeVotingEscrow> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x488b34f704a601daeef14135146a3da79f2d3efc';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(WombatExchangeContractFactory) protected readonly contractFactory: WombatExchangeContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): WombatExchangeVotingEscrow {
    return this.contractFactory.wombatExchangeVotingEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<WombatExchangeVotingEscrow>) {
    return contract.wom();
  }

  getEscrowedTokenBalance({ address, contract }: GetTokenBalancesParams<WombatExchangeVotingEscrow>) {
    return contract.balanceOf(address);
  }
}
