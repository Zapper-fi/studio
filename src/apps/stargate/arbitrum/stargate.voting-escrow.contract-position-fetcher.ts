import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xfbd849e6007f9bc3cc2d6eb159c045b8dc660268';
}
