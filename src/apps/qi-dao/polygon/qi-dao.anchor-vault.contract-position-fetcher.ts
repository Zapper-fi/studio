import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory } from '../contracts';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

export type QiDaoAnchorVaultContractPositionDataProps = {
  liquidity: number;
};

const ANCHOR_VAULTS = [
  {
    tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
    vaultAddress: '0x947d711c25220d8301c087b25ba111fe8cbf6672',
  },
  {
    tokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', //USDT
    vaultAddress: '0xa4742a65f24291aa421497221aaf64c70b098d98',
  },
  {
    tokenAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', //DAI
    vaultAddress: '0x6062e92599a77e62e0cc9749261eb2eac3abd44f',
  },
];

const appId = QI_DAO_DEFINITION.id;
const groupId = QI_DAO_DEFINITION.groups.anchorVault.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonQiDaoAnchorVaultPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) private readonly qiDaoContractFactory: QiDaoContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const anchorVaultContractPositions = await Promise.all(
      ANCHOR_VAULTS.map(async ({ tokenAddress, vaultAddress }) => {
        const underlyingToken = baseTokens.find(v => v.address === tokenAddress);
        if (!underlyingToken) return null;

        const contract = this.qiDaoContractFactory.erc20({ address: tokenAddress, network });
        const [label, balanceRaw] = await Promise.all([
          multicall.wrap(contract).name(),
          multicall.wrap(contract).balanceOf(vaultAddress),
        ]);
        const balance = Number(balanceRaw) / 10 ** underlyingToken?.decimals;

        const liquidity = balance * underlyingToken.price;

        const secondaryLabel = buildDollarDisplayItem(underlyingToken.price);
        const images = [getTokenImg(underlyingToken.address, network)];
        const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

        const contractPosition: ContractPosition<QiDaoAnchorVaultContractPositionDataProps> = {
          type: ContractType.POSITION,
          address: vaultAddress,
          network,
          appId,
          groupId,
          tokens: [underlyingToken],
          dataProps: {
            liquidity,
          },
          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return contractPosition;
      }),
    );

    return _.compact(anchorVaultContractPositions);
  }
}
