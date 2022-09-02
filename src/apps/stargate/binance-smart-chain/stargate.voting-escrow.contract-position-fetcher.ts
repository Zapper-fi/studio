import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class BinanceSmartChainStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.votingEscrow.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xd4888870c8686c748232719051b677791dbda26d';
}
