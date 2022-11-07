import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Injectable()
export class ArbitrumQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.vault.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Vaults';

  vaultDefinitions = [
    {
      address: '0xc76a3cbefe490ae4450b2fcc2c38666aa99f7aa0', // WETH Vault
      vaultInfoAddress: '0xc76a3cbefe490ae4450b2fcc2c38666aa99f7aa0',
    },
    {
      address: '0xb237f4264938f0903f5ec120bb1aa4bee3562fff', // WBTC Vault
      vaultInfoAddress: '0xb237f4264938f0903f5ec120bb1aa4bee3562fff',
    },
  ];
}
