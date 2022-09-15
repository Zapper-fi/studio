import { Injectable } from '@nestjs/common';

import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';

@Injectable()
export class EthereumAbracadabraStakedSpellTokenFetcher extends VaultTemplateTokenFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Staked SPELL';

  vaultAddress = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
  underlyingTokenAddress = '0x090185f2135308bad17527004364ebcc2d37e5f6';
}
