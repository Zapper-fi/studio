import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { EulerDTokenTokenFetcher } from '../common/euler.d-token.token-fetcher';
import { EulerTokenType } from '../common/euler.token-definition-resolver';
import { EULER_DEFINITION } from '../euler.definition';

@Injectable()
export class EthereumEulerDTokenTokenFetcher extends EulerDTokenTokenFetcher {
  appId = EULER_DEFINITION.id;
  groupId = EULER_DEFINITION.groups.dToken.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  tokenType = EulerTokenType.D_TOKEN;
}
