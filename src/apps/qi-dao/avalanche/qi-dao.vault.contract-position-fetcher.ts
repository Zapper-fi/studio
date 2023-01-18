import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';

@PositionTemplate()
export class AvalancheQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
  groupLabel = 'Vaults';

  vaultDefinitions = [
    {
      address: '0xfa19c1d104f4aefb8d5564f02b3adca1b515da58', // mooAaveAVAX Vault
      vaultInfoAddress: '0xfa19c1d104f4aefb8d5564f02b3adca1b515da58',
    },
    {
      address: '0x13a7fe3ab741ea6301db8b164290be711f546a73', // Stake DAO USD Strategy Vault
      vaultInfoAddress: '0x13a7fe3ab741ea6301db8b164290be711f546a73',
    },
    {
      address: '0xa9122dacf3fccf1aae6b8ddd1f75b6267e5cbbb8', // WETH Vault
      vaultInfoAddress: '0xa9122dacf3fccf1aae6b8ddd1f75b6267e5cbbb8',
    },
    {
      address: '0x1f8f7a1d38e41eaf0ed916def29bdd13f2a3f11a', // WBTC Vault
      vaultInfoAddress: '0x1f8f7a1d38e41eaf0ed916def29bdd13f2a3f11a',
    },
    {
      address: '0x73a755378788a4542a780002a75a7bae7f558730', // WAVAX Vault
      vaultInfoAddress: '0x73a755378788a4542a780002a75a7bae7f558730',
    },
  ];
}
