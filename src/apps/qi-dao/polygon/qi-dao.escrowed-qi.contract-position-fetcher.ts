import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Register.ContractPositionFetcher({
  appId: QI_DAO_DEFINITION.id,
  groupId: QI_DAO_DEFINITION.groups.escrowedQi.id,
  network: Network.POLYGON_MAINNET,
})
export class PolygonQiDaoEscrowedQiContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const network = Network.POLYGON_MAINNET;
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const address = '0x880decade22ad9c58a8a4202ef143c4f305100b3';
    const qiToken = baseTokens.find(v => v.symbol === 'QI')!;
    const tokens = [qiToken];

    const contractPosition: ContractPosition = {
      type: ContractType.POSITION,
      address: address,
      appId: QI_DAO_DEFINITION.id,
      groupId: QI_DAO_DEFINITION.groups.escrowedQi.id,
      network: Network.POLYGON_MAINNET,
      dataProps: {},
      displayProps: {
        label: 'Escrowed QI',
        secondaryLabel: buildDollarDisplayItem(qiToken.price),
        images: [getTokenImg(qiToken.address, network)],
      },
      tokens,
    };

    return [contractPosition];
  }
}
