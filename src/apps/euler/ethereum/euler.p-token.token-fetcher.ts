import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EulerPTokenTokenFetcher } from '../common/euler.p-token.token-fetcher';
import { EulerTokenType } from '../common/euler.token-definition-resolver';

@PositionTemplate()
export class EthereumEulerPTokenTokenFetcher extends EulerPTokenTokenFetcher {
  groupLabel = 'Lending';
  tokenType = EulerTokenType.P_TOKEN;
}
