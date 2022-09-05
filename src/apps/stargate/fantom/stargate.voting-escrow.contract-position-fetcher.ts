import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class FantomStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.votingEscrow.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x933421675cdc8c280e5f21f0e061e77849293dba';
}
