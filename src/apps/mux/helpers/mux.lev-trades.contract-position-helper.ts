import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { MuxContractFactory } from '~apps/mux';
import { getCollateralTokensByNetwork, getMarketTokensByNetwork, READER_ADDRESS } from '~apps/mux/helpers/common';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import MUX_DEFINITION from '../mux.definition';

export type MuxLevTradesContractPositionDataProps = {
  collateralTokenId: number;
  marketTokenId: number;
  isLong: boolean;
};

type GetLevTradesContractPositionHelperParams = {
  network: Network;
};

const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.levTrades.id;

@Injectable()
export class MuxLevTradesContractPositionHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly contractFactory: MuxContractFactory,
  ) {}

  async getPosition({ network }: GetLevTradesContractPositionHelperParams) {
    const marketTokensList = await getMarketTokensByNetwork(network, this.appToolkit);
    const collateralTokensList = await getCollateralTokensByNetwork(network, this.appToolkit);

    const positions = await Promise.all(
      collateralTokensList.map(collateralToken => {
        const positionsForGivenPair = marketTokensList.map(marketToken => {
          const shortPosition: ContractPosition<MuxLevTradesContractPositionDataProps> = {
            type: ContractType.POSITION,
            appId,
            groupId,
            address: READER_ADDRESS[network],
            key: `${collateralToken.symbol}:${marketToken.symbol}:short`,
            network,
            tokens: [supplied(collateralToken), marketToken],
            dataProps: {
              collateralTokenId: collateralToken.muxTokenId,
              marketTokenId: marketToken.muxTokenId,
              isLong: false,
            },
            displayProps: {
              label: `Short ${marketToken.symbol}`,
              images: [getTokenImg(collateralToken.address, network), getTokenImg(marketToken.address, network)],
              statsItems: [],
            },
          };
          const longPosition: ContractPosition<MuxLevTradesContractPositionDataProps> = {
            type: ContractType.POSITION,
            appId,
            groupId,
            address: READER_ADDRESS[network],
            key: `${collateralToken.symbol}:${marketToken.symbol}:long`,
            network,
            tokens: [supplied(collateralToken), marketToken],
            dataProps: {
              collateralTokenId: collateralToken.muxTokenId,
              marketTokenId: marketToken.muxTokenId,
              isLong: true,
            },
            displayProps: {
              label: `Long ${marketToken.symbol}`,
              images: [getTokenImg(collateralToken.address, network), getTokenImg(marketToken.address, network)],
              statsItems: [],
            },
          };
          return [shortPosition, longPosition];
        });

        return _.compact(positionsForGivenPair).flat();
      }),
    );

    return positions.flat();
  }
}
