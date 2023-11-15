import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { PlatypusFinanceViemContractFactory } from '../contracts';
import { PlatypusFinanceVotingEscrow } from '../contracts/viem';
import { PlatypusFinanceVotingEscrowContract } from '../contracts/viem/PlatypusFinanceVotingEscrow';

@PositionTemplate()
export class AvalanchePlatypusFinanceVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<PlatypusFinanceVotingEscrow> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x5857019c749147eee22b1fe63500f237f3c1b692';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlatypusFinanceViemContractFactory) protected readonly contractFactory: PlatypusFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): PlatypusFinanceVotingEscrowContract {
    return this.contractFactory.platypusFinanceVotingEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<PlatypusFinanceVotingEscrow>) {
    return contract.read.ptp();
  }

  getEscrowedTokenBalance({ address, contract }: GetTokenBalancesParams<PlatypusFinanceVotingEscrow>) {
    return contract.read.getStakedPtp([address]);
  }
}
