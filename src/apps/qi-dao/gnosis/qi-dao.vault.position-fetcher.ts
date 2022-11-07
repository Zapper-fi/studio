import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Injectable()
export class GnosisQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.vault.id;
  network = Network.GNOSIS_MAINNET;
  groupLabel = 'Vaults';

  vaultDefinitions = [
    {
      address: '0x5c49b268c9841aff1cc3b0a418ff5c3442ee3f3b', // WETH Vault
      vaultInfoAddress: '0x5c49b268c9841aff1cc3b0a418ff5c3442ee3f3b',
    },
    {
      address: '0x014a177e9642d1b4e970418f894985dc1b85657f', // GNO Vault
      vaultInfoAddress: '0x014a177e9642d1b4e970418f894985dc1b85657f',
    },
  ];
}
