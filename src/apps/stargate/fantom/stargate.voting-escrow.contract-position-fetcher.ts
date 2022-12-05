import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';

@PositionTemplate()
export class FantomStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x933421675cdc8c280e5f21f0e061e77849293dba';
}
