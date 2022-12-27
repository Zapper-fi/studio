import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SolaceScpTokenFetcher } from '../common/solace.scp.token-fetcher';

@PositionTemplate()
export class EthereumSolaceScpTokenFetcher extends SolaceScpTokenFetcher {
  groupLabel = 'SCP';
  scpAddress = '0x501acee83a6f269b77c167c6701843d454e2efa0';
}
