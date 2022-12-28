import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { PendleV2ContractFactory, PendleVotingEscrow } from '../contracts';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

@PositionTemplate()
export class EthereumPendleV2VotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<PendleVotingEscrow> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x4f30A9D41B80ecC5B94306AB4364951AE3170210';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ContractFactory) protected readonly pendleV2ContractFactory: PendleV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string) {
    return this.pendleV2ContractFactory.pendleVotingEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<PendleVotingEscrow>) {
    return contract.pendle();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<PendleVotingEscrow>) {
    return contract.positionData(address).then(data => data.amount);
  }
}
