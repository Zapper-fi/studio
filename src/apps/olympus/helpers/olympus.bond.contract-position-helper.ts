import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { claimable, vesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { OLYMPUS_DEFINITION } from '../olympus.definition';

type OlympusDepository = {
  depositoryAddress: string;
  symbol: string;
  images?: string[];
};

type OlympusBondContractPositionHelperParams = {
  appId: string;
  groupId: string;
  network: Network;
  depositories: OlympusDepository[];
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class OlympusBondContractPositionHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions({
    appId,
    groupId,
    network,
    depositories,

    dependencies = [{ appId, groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id], network }],
  }: OlympusBondContractPositionHelperParams) {
    const [baseTokens, appTokens] = await Promise.all([
      this.appToolkit.getBaseTokenPrices(network),
      this.appToolkit.getAppTokenPositions(...dependencies),
    ]);
    const allTokens = [...appTokens, ...baseTokens];

    const mintedToken = allTokens.find(token => token.symbol === 'gOHM');
    if (!mintedToken) {
      throw new Error(`minted token with address gOHM is missing`);
    }

    const depositoryContractPositions = await Promise.all(
      depositories.map(async ({ depositoryAddress, symbol, images }) => {
        const bondContractPosition: ContractPosition = {
          type: ContractType.POSITION,
          address: depositoryAddress,
          appId: appId,
          groupId: groupId,
          network: network,
          tokens: [vesting(mintedToken), claimable(mintedToken)],
          dataProps: {},
          displayProps: {
            label: `Bond`,
            images: images || [getTokenImg(symbol, network)],
            statsItems: [],
          },
        };

        return bondContractPosition;
      }),
    );

    return _.compact(depositoryContractPositions);
  }
}
