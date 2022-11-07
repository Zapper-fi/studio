import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Injectable()
export class OptimismQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.vault.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Vaults';

  vaultDefinitions = [
    {
      address: '0x062016cd29fabb26c52bab646878987fc9b0bc55', // WETH Vault
      vaultInfoAddress: '0x062016cd29fabb26c52bab646878987fc9b0bc55',
    },
    {
      address: '0xb9c8f0d3254007ee4b98970b94544e473cd610ec', // WBTC Vault
      vaultInfoAddress: '0xb9c8f0d3254007ee4b98970b94544e473cd610ec',
    },
    {
      address: '0xbf1aea8670d2528e08334083616dd9c5f3b087ae', // OP Vault
      vaultInfoAddress: '0xbf1aea8670d2528e08334083616dd9c5f3b087ae',
    },
  ];
}
