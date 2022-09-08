import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { UnagiiVaultTokenFetcher } from '../common/unagii.vault-token-fetcher';
import { UNAGII_DEFINITION } from '../unagii.definition';

@Injectable()
export class EthereumUnagiiVaultTokenFetcher extends UnagiiVaultTokenFetcher {
  appId = UNAGII_DEFINITION.id;
  groupId = UNAGII_DEFINITION.groups.vault.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Vaults';
  vaultManagerAddresses = [
    '0x7f75d72886d6a8677321e5602d18948abcb4281a',
    '0xb088d7c71ea9ebaed981c103fc3019b59950d2c9',
    '0x8ef11c51a666c53aeeec504f120cd1435e451342',
  ];
}
