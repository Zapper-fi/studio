import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixMintrContractPositionHelperParams = {
  network: Network;
};

@Injectable()
export class SynthetixMintrContractPositionHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions({ network }: SynthetixMintrContractPositionHelperParams) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const snxToken = baseTokens.find(p => p.symbol === 'SNX')!;
    const susdToken = baseTokens.find(p => p.symbol === 'sUSD')!;
    const tokens = [supplied(snxToken), borrowed(susdToken)];

    // Display Props
    const label = `Minted ${susdToken.symbol}`;
    const secondaryLabel = buildDollarDisplayItem(snxToken.price);
    const images = [getTokenImg(snxToken.address, network), getTokenImg(susdToken.address, network)];

    const position: ContractPosition = {
      type: ContractType.POSITION,
      address: snxToken.address,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.mintr.id,
      network,
      tokens,
      dataProps: {},
      displayProps: {
        label,
        secondaryLabel,
        images,
      },
    };

    return [position];
  }
}
