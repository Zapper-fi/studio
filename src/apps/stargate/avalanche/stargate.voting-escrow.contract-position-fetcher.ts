import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';

@PositionTemplate()
export class AvalancheStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xca0f57d295bbce554da2c07b005b7d6565a58fce';
}
