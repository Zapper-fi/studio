import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { QiDaoVaultPositionHelper, QiDaoVaultPositionDataProps } from '../helpers/qi-dao.vault.position-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({
  appId: QI_DAO_DEFINITION.id,
  groupId: QI_DAO_DEFINITION.groups.vault.id,
  network: Network.POLYGON_MAINNET,
})
export class PolygonQiDaoVaultPositionFetcher
  implements PositionFetcher<ContractPosition<QiDaoVaultPositionDataProps>>
{
  readonly maiAddress = '0xa3fa99a148fa48d14ed51d610c367c61876997f1';

  constructor(
    @Inject(QiDaoVaultPositionHelper) protected readonly qiDaoVaultPositionHelper: QiDaoVaultPositionHelper,
  ) {}

  async getPositions() {
    return this.qiDaoVaultPositionHelper.getPositions({
      network,
      debtTokenAddress: '0xa3fa99a148fa48d14ed51d610c367c61876997f1',
      dependencies: [
        {
          appId: 'quickswap',
          groupIds: ['d-quick'],
          network,
        },
        {
          appId: QI_DAO_DEFINITION.id,
          groupIds: [QI_DAO_DEFINITION.groups.yield.id],
          network,
        },
      ],
      vaults: [
        {
          nftAddress: '0x6af1d9376a7060488558cfb443939ed67bb9b48d',
          vaultInfoAddress: '0xa3fa99a148fa48d14ed51d610c367c61876997f1',
        },
        {
          nftAddress: '0x3fd939b017b31eaadf9ae50c7ff7fa5c0661d47c', // WETH
          vaultInfoAddress: '0x3fd939b017b31eaadf9ae50c7ff7fa5c0661d47c',
        },
        {
          nftAddress: '0x61167073e31b1dad85a3e531211c7b8f1e5cae72', // LINK
          vaultInfoAddress: '0x61167073e31b1dad85a3e531211c7b8f1e5cae72',
        },
        {
          nftAddress: '0x87ee36f780ae843a78d5735867bc1c13792b7b11', // AAVE
          vaultInfoAddress: '0x87ee36f780ae843a78d5735867bc1c13792b7b11',
        },
        {
          nftAddress: '0x98b5f32dd9670191568b661a3e847ed764943875', // CRV
          vaultInfoAddress: '0x98b5f32dd9670191568b661a3e847ed764943875',
        },
        {
          nftAddress: '0x701a1824e5574b0b6b1c8da808b184a7ab7a2867', // BAL
          vaultInfoAddress: '0x701a1824e5574b0b6b1c8da808b184a7ab7a2867',
        },
        {
          nftAddress: '0x649aa6e6b6194250c077df4fb37c23ee6c098513', // dQUICK
          vaultInfoAddress: '0x649aa6e6b6194250c077df4fb37c23ee6c098513',
        },
        {
          nftAddress: '0x37131aedd3da288467b6ebe9a77c523a700e6ca1', // WBTC
          vaultInfoAddress: '0x37131aedd3da288467b6ebe9a77c523a700e6ca1',
        },
        {
          nftAddress: '0xf086dedf6a89e7b16145b03a6cb0c0a9979f1433', // GHST
          vaultInfoAddress: '0xf086dedf6a89e7b16145b03a6cb0c0a9979f1433',
        },
        {
          nftAddress: '0x11a33631a5b5349af3f165d2b7901a4d67e561ad', // camWETH
          vaultInfoAddress: '0x11a33631a5b5349af3f165d2b7901a4d67e561ad',
        },
        {
          nftAddress: '0x578375c3af7d61586c2c3a7ba87d2eed640efa40', // camAAVE
          vaultInfoAddress: '0x578375c3af7d61586c2c3a7ba87d2eed640efa40',
        },
        {
          nftAddress: '0x7dda5e1a389e0c1892caf55940f5fce6588a9ae0', // camWBTC
          vaultInfoAddress: '0x7dda5e1a389e0c1892caf55940f5fce6588a9ae0',
        },
        {
          nftAddress: '0x88d84a85a87ed12b8f098e8953b322ff789fcd1a', // camWMATIC
          vaultInfoAddress: '0x88d84a85a87ed12b8f098e8953b322ff789fcd1a',
        },
        {
          nftAddress: '0xd2fe44055b5c874fee029119f70336447c8e8827', // camDAI
          vaultInfoAddress: '0xd2fe44055b5c874fee029119f70336447c8e8827',
        },
      ],
    });
  }
}
