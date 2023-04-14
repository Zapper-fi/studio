import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';

@PositionTemplate()
export class OptimismQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
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
    {
      address: '0xab91c51b55f7dd7b34f2fd7217506fd5b632b2b9', // Beefy Aave Optimism BTC Vault
      vaultInfoAddress: '0xab91c51b55f7dd7b34f2fd7217506fd5b632b2b9',
    },
    {
      address: '0xf9ce2522027bd40d3b1aee4abe969831fe3beaf5', // Beefy Aave Optimism ETH Vault
      vaultInfoAddress: '0xf9ce2522027bd40d3b1aee4abe969831fe3beaf5',
    },
    {
      address: '0xb89c1b3d9f335b9d8bb16016f3d60160ae71041f', // Beefy Aave Optimism DAI Vault
      vaultInfoAddress: '0xb89c1b3d9f335b9d8bb16016f3d60160ae71041f',
    },
    {
      address: '0x86f78d3cbca0636817ad9e27a44996c738ec4932', // wstETH Vault
      vaultInfoAddress: '0x86f78d3cbca0636817ad9e27a44996c738ec4932',
    },
    {
      address: '0xa478e708a27853848c6bc979668fe6225fee46fa', // Beefy steCRV Vault
      vaultInfoAddress: '0xa478e708a27853848c6bc979668fe6225fee46fa',
    },
    {
      address: '0x7198ff382b5798dab7dc72a23c1fec9dc091893b', // Yearn ETH Vault
      vaultInfoAddress: '0x7198ff382b5798dab7dc72a23c1fec9dc091893b',
    },
  ];
}
