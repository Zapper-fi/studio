import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
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
