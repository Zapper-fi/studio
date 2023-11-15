import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { WombatExchangeViemContractFactory } from '../contracts';
import { WombatExchangeVotingEscrow } from '../contracts/viem';
import { WombatExchangeVotingEscrowContract } from '../contracts/viem/WombatExchangeVotingEscrow';

@PositionTemplate()
export class BinanceSmartChainWombatExchangeVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<WombatExchangeVotingEscrow> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x3da62816dd31c56d9cdf22c6771ddb892cb5b0cc';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(WombatExchangeViemContractFactory) protected readonly contractFactory: WombatExchangeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): WombatExchangeVotingEscrowContract {
    return this.contractFactory.wombatExchangeVotingEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<WombatExchangeVotingEscrow>) {
    return contract.read.wom();
  }

  getEscrowedTokenBalance({ address, contract }: GetTokenBalancesParams<WombatExchangeVotingEscrow>) {
    return contract.read.balanceOf([address]);
  }
}
