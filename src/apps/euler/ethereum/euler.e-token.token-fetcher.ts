import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { EulerETokenTokenFetcher } from '../common/euler.e-token.token-fetcher';
import { EulerTokenType } from '../common/euler.token-definition-resolver';
import { EULER_DEFINITION } from '../euler.definition';

@Injectable()
export class EthereumEulerETokenTokenFetcher extends EulerETokenTokenFetcher {
  appId = EULER_DEFINITION.id;
  groupId = EULER_DEFINITION.groups.eToken.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  tokenType = EulerTokenType.E_TOKEN;
}
