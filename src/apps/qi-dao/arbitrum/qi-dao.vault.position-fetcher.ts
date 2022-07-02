import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { QiDaoVaultPositionDataProps, QiDaoVaultPositionHelper } from '../helpers/qi-dao.vault.position-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const appId = QI_DAO_DEFINITION.id;
const groupId = QI_DAO_DEFINITION.groups.vault.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class ArbitrumQiDaoVaultPositionFetcher implements PositionFetcher<ContractPosition<QiDaoVaultPositionDataProps>> {
  constructor(@Inject(QiDaoVaultPositionHelper) private readonly qiDaoVaultPositionHelper: QiDaoVaultPositionHelper) { }

  getPositions() {
    return this.qiDaoVaultPositionHelper.getPositions({
      network,
      debtTokenAddress: '0x3f56e0c36d275367b8c502090edf38289b3dea0d',
      vaults: [
        {
          nftAddress: '0xc76a3cbefe490ae4450b2fcc2c38666aa99f7aa0', // WETH
          vaultInfoAddress: '0xc76a3cbefe490ae4450b2fcc2c38666aa99f7aa0',
        },
        {
          nftAddress: '0xb237f4264938f0903f5ec120bb1aa4bee3562fff', // WBTC
          vaultInfoAddress: '0xb237f4264938f0903f5ec120bb1aa4bee3562fff',
        },
      ],
    });
  }
}
