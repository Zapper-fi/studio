import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import MYCELIUM_DEFINITION from '../mycelium.definition';

import { MYC_LENDING_ADDRESS, MYC_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS } from './mycelium.constants';

type MyceliumLendingContractPositionHelperParams = {
  network: Network;
};

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.lending.id;

@Injectable()
export class MyceliumLendingContractPositionHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPosition({ network }: MyceliumLendingContractPositionHelperParams) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const suppliedToken = baseTokens.find(token => token.address === MYC_TOKEN_ADDRESS);
    const rewardToken = baseTokens.find(token => token.address === WETH_TOKEN_ADDRESS);

    if (!suppliedToken || !rewardToken) return [];

    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      network,
      address: MYC_LENDING_ADDRESS,
      tokens: [supplied(suppliedToken), claimable(rewardToken)],
      dataProps: {},
      displayProps: {
        label: 'Lending MYC',
        images: [getTokenImg(suppliedToken.address, network), getTokenImg(rewardToken.address, network)],
        statsItems: [],
      },
    };

    return [position];
  }
}
