import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoVaultContractPositionFetcher } from '../common/qi-dao.vault.contract-position-fetcher';

@PositionTemplate()
export class FantomQiDaoVaultPositionFetcher extends QiDaoVaultContractPositionFetcher {
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
    {
      address: '0x7ae52477783c4e3e5c1476bbb29a8d029c920676', // yvETH Vault
      vaultInfoAddress: '0x7ae52477783c4e3e5c1476bbb29a8d029c920676',
    },
    {
      address: '0x571f42886c31f9b769ad243e81d06d0d144be7b4', // yvBTC Vault
      vaultInfoAddress: '0x571f42886c31f9b769ad243e81d06d0d144be7b4',
    },
    {
      address: '0x6d6029557a06961acc5f81e1fff5a474c54e32fd', // yvYFI Vault
      vaultInfoAddress: '0x6d6029557a06961acc5f81e1fff5a474c54e32fd',
    },
    {
      address: '0xe5996a2cb60ea57f03bf332b5adc517035d8d094', // BTC Vault
      vaultInfoAddress: '0xe5996a2cb60ea57f03bf332b5adc517035d8d094',
    },
    {
      address: '0x3609a304c6a41d87e895b9c1fd18c02ba989ba90', // mooScreamFTM Vault
      vaultInfoAddress: '0x3609a304c6a41d87e895b9c1fd18c02ba989ba90',
    },
    {
      address: '0xc1c7ef18abc94013f6c58c6cdf9e829a48075b4e', // mooScreamETH Vault
      vaultInfoAddress: '0xc1c7ef18abc94013f6c58c6cdf9e829a48075b4e',
    },
    {
      address: '0x5563cc1ee23c4b17c861418cff16641d46e12436', // mooScreamBTC Vault
      vaultInfoAddress: '0x5563cc1ee23c4b17c861418cff16641d46e12436',
    },
    {
      address: '0x8e5e4d08485673770ab372c05f95081be0636fa2', // mooScreamLINK Vault
      vaultInfoAddress: '0x8e5e4d08485673770ab372c05f95081be0636fa2',
    },
    {
      address: '0xbf0ff8ac03f3e0dd7d8faa9b571eba999a854146', // mooScreamDAI Vault
      vaultInfoAddress: '0xbf0ff8ac03f3e0dd7d8faa9b571eba999a854146',
    },
    {
      address: '0xf34e271312e41bbd7c451b76af2af8339d6f16ed', // mooBooBTC-FTM Vault
      vaultInfoAddress: '0xf34e271312e41bbd7c451b76af2af8339d6f16ed',
    },
    {
      address: '0x9ba01b1279b1f7152b42aca69faf756029a9abde', // mooBooETH-FTM Vault
      vaultInfoAddress: '0x9ba01b1279b1f7152b42aca69faf756029a9abde',
    },
    {
      address: '0x75d4ab6843593c111eeb02ff07055009c836a1ef', // mooBIFI Vault
      vaultInfoAddress: '0x75d4ab6843593c111eeb02ff07055009c836a1ef',
    },
    {
      address: '0x3f6cf10e85e9c0630856599fab8d8bfcd9c0e7d4', // xBOO Vault (V2)
      vaultInfoAddress: '0x3f6cf10e85e9c0630856599fab8d8bfcd9c0e7d4',
    },
  ];
}
