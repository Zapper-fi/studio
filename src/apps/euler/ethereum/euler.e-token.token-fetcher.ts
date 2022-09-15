import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EulerETokenTokenFetcher } from '../common/euler.e-token.token-fetcher';
import { EulerTokenType } from '../common/euler.token-definition-resolver';

@PositionTemplate()
export class EthereumEulerETokenTokenFetcher extends EulerETokenTokenFetcher {
  groupLabel = 'Lending';
  tokenType = EulerTokenType.E_TOKEN;
}
