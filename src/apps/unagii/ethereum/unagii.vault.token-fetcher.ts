import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UnagiiVaultTokenFetcher } from '../common/unagii.vault-token-fetcher';

@PositionTemplate()
export class EthereumUnagiiVaultTokenFetcher extends UnagiiVaultTokenFetcher {
  groupLabel = 'Vaults';
  vaultManagerAddresses = [
    '0x7f75d72886d6a8677321e5602d18948abcb4281a',
    '0xb088d7c71ea9ebaed981c103fc3019b59950d2c9',
    '0x8ef11c51a666c53aeeec504f120cd1435e451342',
  ];
}
