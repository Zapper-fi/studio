import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { EulerPTokenTokenFetcher } from '../common/euler.p-token.token-fetcher';
import { EulerTokenType } from '../common/euler.token-definition-resolver';
import { EULER_DEFINITION } from '../euler.definition';

@Injectable()
export class EthereumEulerPTokenTokenFetcher extends EulerPTokenTokenFetcher {
  appId = EULER_DEFINITION.id;
  groupId = EULER_DEFINITION.groups.pToken.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  tokenType = EulerTokenType.P_TOKEN;
}
