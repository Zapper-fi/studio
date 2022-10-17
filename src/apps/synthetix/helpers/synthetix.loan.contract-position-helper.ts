import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getTokenImg, getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixLoanContractPositionHelperParams = {
  loanContractAddress: string;
  network: Network;
};

const appId = SYNTHETIX_DEFINITION.id;

@Injectable()
export class SynthetixLoanContractPositionHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions({ loanContractAddress, network }: SynthetixLoanContractPositionHelperParams) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const ethToken = baseTokens.find(p => p.address === ZERO_ADDRESS)!;
    const susdToken = baseTokens.find(p => p.symbol === 'sUSD')!;
    const sethToken = baseTokens.find(p => p.symbol === 'sETH')!;
    const tokens = [supplied(ethToken), borrowed(susdToken), borrowed(sethToken)];

    // Display Props
    const label = SYNTHETIX_DEFINITION.groups.loan.label;
    const images = [
      getTokenImg(ethToken.address, network),
      getAppAssetImage(appId, susdToken.symbol),
      getAppAssetImage(appId, sethToken.symbol),
    ];

    const position: ContractPosition = {
      type: ContractType.POSITION,
      address: loanContractAddress,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.loan.id,
      network,
      tokens,
      dataProps: {},
      displayProps: {
        label,
        images,
      },
    };

    return [position];
  }
}
