import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Injectable()
export class FantomQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.vault.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Vaults';

  vaultDefinitions = [
    {
      address: '0x1066b8fc999c1ee94241344818486d5f944331a0', // FTM Vault
      vaultInfoAddress: '0x1066b8fc999c1ee94241344818486d5f944331a0',
    },
    {
      address: '0x7efb260662a6fa95c1ce1092c53ca23733202798', // yvWFTM Vault
      vaultInfoAddress: '0x7efb260662a6fa95c1ce1092c53ca23733202798',
    },
    {
      address: '0xdb09908b82499cadb9e6108444d5042f81569bd9', // AAVE Vault
      vaultInfoAddress: '0xdb09908b82499cadb9e6108444d5042f81569bd9',
    },
    {
      address: '0xd6488d586e8fcd53220e4804d767f19f5c846086', // LINK Vault
      vaultInfoAddress: '0xd6488d586e8fcd53220e4804d767f19f5c846086',
    },
    {
      address: '0x267bdd1c19c932ce03c7a62bbe5b95375f9160a6', // SUSHI Vault
      vaultInfoAddress: '0x267bdd1c19c932ce03c7a62bbe5b95375f9160a6',
    },
    {
      address: '0xd939c268c49c442f037e968f045ba02f499562d4', // ETH Vault
      vaultInfoAddress: '0xd939c268c49c442f037e968f045ba02f499562d4',
    },
    {
      address: '0x682e473fca490b0adfa7efe94083c1e63f28f034', // yvDAI Vault
      vaultInfoAddress: '0x682e473fca490b0adfa7efe94083c1e63f28f034',
    },
  ];
}
