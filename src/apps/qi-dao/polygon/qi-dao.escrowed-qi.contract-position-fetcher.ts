import { Inject } from '@nestjs/common';

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

const appId = QI_DAO_DEFINITION.id;
const groupId = QI_DAO_DEFINITION.groups.escrowedQi.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonQiDaoEscrowedQiContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) private readonly qiDaoContractFactory: QiDaoContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const address = '0x880decade22ad9c58a8a4202ef143c4f305100b3';
    const qiToken = baseTokens.find(v => v.symbol === 'QI')!;
    const tokens = [qiToken];

    const qiTokencontract = this.qiDaoContractFactory.erc20({ address: qiToken.address, network });

    const [decimals, balanceRaw] = await Promise.all([
      multicall.wrap(qiTokencontract).decimals(),
      multicall.wrap(qiTokencontract).balanceOf(address),
    ]);

    const balance = Number(balanceRaw) / 10 ** decimals;
    const liquidity = balance * qiToken.price;

    const contractPosition: ContractPosition = {
      type: ContractType.POSITION,
      address: address,
      appId,
      groupId,
      network,
      dataProps: {
        liquidity,
      },
      displayProps: {
        label: 'Escrowed QI',
        secondaryLabel: buildDollarDisplayItem(qiToken.price),
        images: [getTokenImg(qiToken.address, network)],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
      tokens,
    };

    return [contractPosition];
  }
}
