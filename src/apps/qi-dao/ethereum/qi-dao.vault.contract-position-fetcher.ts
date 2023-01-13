import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';

@PositionTemplate()
export class EthereumQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
  groupLabel = 'Vaults';

  vaultDefinitions = [
    {
      address: '0x60d133c666919b54a3254e0d3f14332cb783b733', // Yearn LINK Ethereum MAI Vault
      vaultInfoAddress: '0x60d133c666919b54a3254e0d3f14332cb783b733',
    },
    {
      address: '0xecbd32bd581e241739be1763dfe7a8ffcc844ae1', // Yearn ETH Ethereum MAI Vault
      vaultInfoAddress: '0xecbd32bd581e241739be1763dfe7a8ffcc844ae1',
    },
    {
      address: '0x82e90eb7034c1df646bd06afb9e67281aab5ed28', // Yearn Curve stETH MAI Vault
      vaultInfoAddress: '0x82e90eb7034c1df646bd06afb9e67281aab5ed28',
    },
    {
      address: '0x98eb27e5f24fb83b7d129d789665b08c258b4ccf', // WETH MAI Vault
      vaultInfoAddress: '0x98eb27e5f24fb83b7d129d789665b08c258b4ccf',
    },
    {
      address: '0x8c45969ad19d297c9b85763e90d0344c6e2ac9d1', // WBTC MAI Vault
      vaultInfoAddress: '0x8c45969ad19d297c9b85763e90d0344c6e2ac9d1',
    },
    {
      address: '0xcc61ee649a95f2e2f0830838681f839bdb7cb823', // StakeDao Curve stETH MAI Vault
      vaultInfoAddress: '0xcc61ee649a95f2e2f0830838681f839bdb7cb823',
    },
  ];
}
