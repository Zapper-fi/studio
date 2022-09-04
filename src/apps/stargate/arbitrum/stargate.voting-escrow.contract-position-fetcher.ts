import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class ArbitrumStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.votingEscrow.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xfbd849e6007f9bc3cc2d6eb159c045b8dc660268';
}
