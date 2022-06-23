import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { YEARN_DEFINITION } from '~apps/yearn';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { QiDaoVaultPositionDataProps, QiDaoVaultPositionHelper } from '../helpers/qi-dao.vault.position-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const appId = QI_DAO_DEFINITION.id;
const groupId = QI_DAO_DEFINITION.groups.vault.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class FantomQiDaoVaultPositionFetcher implements PositionFetcher<ContractPosition<QiDaoVaultPositionDataProps>> {
  constructor(@Inject(QiDaoVaultPositionHelper) private readonly qiDaoVaultPositionHelper: QiDaoVaultPositionHelper) {}

  getPositions() {
    return this.qiDaoVaultPositionHelper.getPositions({
      network,
      debtTokenAddress: '0xfb98b335551a418cd0737375a2ea0ded62ea213b',
      dependencies: [
        {
          appId: YEARN_DEFINITION.id,
          groupIds: [YEARN_DEFINITION.groups.v2Vault.id],
          network,
        },
      ],
      vaults: [
        {
          nftAddress: '0x1066b8fc999c1ee94241344818486d5f944331a0', // FTM
          vaultInfoAddress: '0x1066b8fc999c1ee94241344818486d5f944331a0',
        },
        {
          nftAddress: '0x7efb260662a6fa95c1ce1092c53ca23733202798', // yvWFTM
          vaultInfoAddress: '0x7efb260662a6fa95c1ce1092c53ca23733202798',
        },
        {
          nftAddress: '0xdb09908b82499cadb9e6108444d5042f81569bd9', // AAVE
          vaultInfoAddress: '0xdb09908b82499cadb9e6108444d5042f81569bd9',
        },
        {
          nftAddress: '0xd6488d586e8fcd53220e4804d767f19f5c846086', // LINK
          vaultInfoAddress: '0xd6488d586e8fcd53220e4804d767f19f5c846086',
        },
        {
          nftAddress: '0x267bdd1c19c932ce03c7a62bbe5b95375f9160a6', // SUSHI
          vaultInfoAddress: '0x267bdd1c19c932ce03c7a62bbe5b95375f9160a6',
        },
        {
          nftAddress: '0xd939c268c49c442f037e968f045ba02f499562d4', // ETH
          vaultInfoAddress: '0xd939c268c49c442f037e968f045ba02f499562d4',
        },
        {
          nftAddress: '0x682e473fca490b0adfa7efe94083c1e63f28f034', // yvDAI
          vaultInfoAddress: '0x682e473fca490b0adfa7efe94083c1e63f28f034',
        },
      ],
    });
  }
}
