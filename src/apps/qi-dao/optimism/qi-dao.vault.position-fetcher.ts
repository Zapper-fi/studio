import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { QiDaoVaultPositionDataProps, QiDaoVaultPositionHelper } from '../helpers/qi-dao.vault.position-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const appId = QI_DAO_DEFINITION.id;
const groupId = QI_DAO_DEFINITION.groups.vault.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismQiDaoVaultPositionFetcher
  implements PositionFetcher<ContractPosition<QiDaoVaultPositionDataProps>>
{
  constructor(@Inject(QiDaoVaultPositionHelper) private readonly qiDaoVaultPositionHelper: QiDaoVaultPositionHelper) {}

  getPositions() {
    return this.qiDaoVaultPositionHelper.getPositions({
      network,
      debtTokenAddress: '0xdfa46478f9e5ea86d57387849598dbfb2e964b02',
      vaults: [
        {
          nftAddress: '0x062016cd29fabb26c52bab646878987fc9b0bc55', // WETH
          vaultInfoAddress: '0x062016cd29fabb26c52bab646878987fc9b0bc55',
        },
        {
          nftAddress: '0xb9c8f0d3254007ee4b98970b94544e473cd610ec', // WBTC
          vaultInfoAddress: '0xb9c8f0d3254007ee4b98970b94544e473cd610ec',
        },
        {
          nftAddress: '0xbf1aea8670d2528e08334083616dd9c5f3b087ae', // OP
          vaultInfoAddress: '0xbf1aea8670d2528e08334083616dd9c5f3b087ae',
        },
      ],
    });
  }
}
