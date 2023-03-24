import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
  groupLabel = 'Vaults';

  vaultDefinitions = [
    {
      address: '0xa56f9a54880afbc30cf29bb66d2d9adcdcaeadd6', // wBNB Vault
      vaultInfoAddress: '0xa56f9a54880afbc30cf29bb66d2d9adcdcaeadd6',
    },
    {
      address: '0x014a177e9642d1b4e970418f894985dc1b85657f', // CAKE Vault
      vaultInfoAddress: '0x014a177e9642d1b4e970418f894985dc1b85657f',
    },
    {
      address: '0x7333fd58d8d73a8e5fc1a16c8037ada4f580fa2b', // DODO Vault
      vaultInfoAddress: '0x7333fd58d8d73a8e5fc1a16c8037ada4f580fa2b',
    },
  ];
}
