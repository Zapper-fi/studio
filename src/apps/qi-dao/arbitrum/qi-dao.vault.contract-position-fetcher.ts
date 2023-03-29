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
    {
      address: '0xd371281896f2f5f7a2c65f49d23a2b6ecfd594f3', // gDAI Vault
      vaultInfoAddress: '0xd371281896f2f5f7a2c65f49d23a2b6ecfd594f3',
    },
  ];
}
