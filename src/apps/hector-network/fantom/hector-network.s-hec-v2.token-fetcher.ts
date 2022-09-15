import { Injectable } from '@nestjs/common';

import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

@Injectable()
export class FantomHectorNetworkSHecV2TokenFetcher extends WrapperTemplateTokenFetcher {
  appId = HECTOR_NETWORK_DEFINITION.id;
  groupId = HECTOR_NETWORK_DEFINITION.groups.sHecV2.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Staked HEC V2';

  vaultAddress = '0x75bdef24285013387a47775828bec90b91ca9a5f';
  underlyingTokenAddress = '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0';
}
