import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { PendleV2ViemContractFactory } from '../contracts';
import { PendleVotingEscrow } from '../contracts/viem';

@PositionTemplate()
export class EthereumPendleV2VotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<PendleVotingEscrow> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x4f30a9d41b80ecc5b94306ab4364951ae3170210';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ViemContractFactory) protected readonly pendleV2ContractFactory: PendleV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string) {
    return this.pendleV2ContractFactory.pendleVotingEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<PendleVotingEscrow>) {
    return contract.read.pendle();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<PendleVotingEscrow>) {
    return contract.read.positionData([address]).then(data => data[0]);
  }
}
