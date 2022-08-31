import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { StargateVotingEscrowContractPositionFetcher } from '../common/stargate.voting-escrow.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.votingEscrow.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainStargateVotingEscrowContractPositionFetcher extends StargateVotingEscrowContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xd4888870c8686c748232719051b677791dbda26d';
}
