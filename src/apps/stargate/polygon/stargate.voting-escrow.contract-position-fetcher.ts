import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';

@PositionTemplate()
export class PolygonStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x3ab2da31bbd886a7edf68a6b60d3cde657d3a15d';
}
