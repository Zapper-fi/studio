import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SolaceXSolacev1TokenFetcher } from '../common/solace.x-solace-v1.token-fetcher';

@PositionTemplate()
export class EthereumSolaceXsolacev1TokenFetcher extends SolaceXSolacev1TokenFetcher {
  groupLabel = 'xSOLACEv1';
  xSolaceV1Address = '0x501ace5ac3af20f49d53242b6d208f3b91cfc411';
}
