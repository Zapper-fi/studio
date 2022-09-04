import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class EthereumStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.votingEscrow.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x0e42acbd23faee03249daff896b78d7e79fbd58e';
}
