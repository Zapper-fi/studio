import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class PolygonStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.votingEscrow.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x3ab2da31bbd886a7edf68a6b60d3cde657d3a15d';
}
