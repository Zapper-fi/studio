import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';

@PositionTemplate()
export class OptimismStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x43d2761ed16c89a2c4342e2b16a3c61ccf88f05b';
}
