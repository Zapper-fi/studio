import { Injectable } from '@nestjs/common';

import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

@Injectable()
export class FantomHectorNetworkWsHecTokenFetcher extends VaultTemplateTokenFetcher {
  appId = HECTOR_NETWORK_DEFINITION.id;
  groupId = HECTOR_NETWORK_DEFINITION.groups.wsHec.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Wrapped sHEC V2';

  vaultAddress = '0x94ccf60f700146bea8ef7832820800e2dfa92eda';
  underlyingTokenAddress = '0x75bdef24285013387a47775828bec90b91ca9a5f';
}
