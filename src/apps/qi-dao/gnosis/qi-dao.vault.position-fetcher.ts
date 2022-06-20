import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { QiDaoVaultPositionDataProps, QiDaoVaultPositionHelper } from '../helpers/qi-dao.vault.position-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const appId = QI_DAO_DEFINITION.id;
const groupId = QI_DAO_DEFINITION.groups.vault.id;
const network = Network.GNOSIS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class GnosisQiDaoVaultPositionFetcher implements PositionFetcher<ContractPosition<QiDaoVaultPositionDataProps>> {
  constructor(@Inject(QiDaoVaultPositionHelper) private readonly qiDaoVaultPositionHelper: QiDaoVaultPositionHelper) { }

  getPositions() {
    return this.qiDaoVaultPositionHelper.getPositions({
      network,
      debtTokenAddress: '0x3f56e0c36d275367b8c502090edf38289b3dea0d',
      vaults: [
        {
          nftAddress: '0x5c49b268c9841aff1cc3b0a418ff5c3442ee3f3b', // WETH
          vaultInfoAddress: '0x5c49b268c9841aff1cc3b0a418ff5c3442ee3f3b',
        },
        {
          nftAddress: '0x014a177e9642d1b4e970418f894985dc1b85657f', // GNO
          vaultInfoAddress: '0x014a177e9642d1b4e970418f894985dc1b85657f',
        }
      ],
    });
  }
}
