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
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    // USDC may be included in the user's position income
    let extraToken = await baseTokens.find(x => x.symbol == 'USDC');

    const positions = await Promise.all(
      collateralTokensList.map(collateralToken => {
        const positionsForGivenPair = marketTokensList.map(marketToken => {
          // Avoid showing the same balance twice
          if (marketToken.symbol === collateralToken.symbol) return;
          if (marketToken.symbol === 'USDC' || collateralToken.symbol === 'USDC') {
            extraToken = undefined;
          }
          const shortPosition: ContractPosition<MuxLevTradesContractPositionDataProps> = {
            type: ContractType.POSITION,
            appId,
            groupId,
            address: READER_ADDRESS[network],
            key: `${marketToken.symbol}:${collateralToken.symbol}:short`,
            network,
            tokens: _.compact([marketToken, supplied(collateralToken), extraToken]),
            dataProps: {
              collateralTokenId: collateralToken.muxTokenId,
              marketTokenId: marketToken.muxTokenId,
              isLong: false,
            },
            displayProps: {
              label: `Short ${marketToken.symbol} / ${collateralToken.symbol}`,
              images: [getTokenImg(marketToken.address, network), getTokenImg(collateralToken.address, network)],
              statsItems: [],
            },
          };
          const longPosition: ContractPosition<MuxLevTradesContractPositionDataProps> = {
            type: ContractType.POSITION,
            appId,
            groupId,
            address: READER_ADDRESS[network],
            key: `${marketToken.symbol}:${collateralToken.symbol}:long`,
            network,
            tokens: _.compact([marketToken, supplied(collateralToken), extraToken]),
            dataProps: {
              collateralTokenId: collateralToken.muxTokenId,
              marketTokenId: marketToken.muxTokenId,
              isLong: true,
            },
            displayProps: {
              label: `Long ${marketToken.symbol} / ${collateralToken.symbol}`,
              images: [getTokenImg(marketToken.address, network), getTokenImg(collateralToken.address, network)],
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
