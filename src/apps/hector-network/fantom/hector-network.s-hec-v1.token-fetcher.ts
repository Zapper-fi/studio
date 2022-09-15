import { Injectable } from '@nestjs/common';

import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

@Injectable()
export class FantomHectorNetworkSHecV1TokenFetcher extends WrapperTemplateTokenFetcher {
  appId = HECTOR_NETWORK_DEFINITION.id;
  groupId = HECTOR_NETWORK_DEFINITION.groups.sHecV1.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Staked HEC V1';

  vaultAddress = '0x36f26880c6406b967bdb9901cde43abc9d53f106';
  underlyingTokenAddress = '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0';
}
