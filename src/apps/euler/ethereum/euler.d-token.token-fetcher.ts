import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EulerDTokenTokenFetcher } from '../common/euler.d-token.token-fetcher';
import { EulerTokenType } from '../common/euler.token-definition-resolver';

@PositionTemplate()
export class EthereumEulerDTokenTokenFetcher extends EulerDTokenTokenFetcher {
  groupLabel = 'Lending';
  tokenType = EulerTokenType.D_TOKEN;
}
