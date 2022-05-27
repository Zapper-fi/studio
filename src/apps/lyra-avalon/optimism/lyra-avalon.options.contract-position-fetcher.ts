import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LYRA_AVALON_DEFINITION } from '../lyra-avalon.definition';

import { OPTION_TYPES } from './helpers/consts';
import { getOptions } from './helpers/graph';

const appId = LYRA_AVALON_DEFINITION.id;
const groupId = LYRA_AVALON_DEFINITION.groups.options.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismLyraAvalonOptionsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const response = await getOptions(this.appToolkit.helpers.theGraphHelper);

    const markets = response.markets.map(market => {
      const quoteToken = baseTokens.find(t => t.address === market.quoteAddress.toLowerCase())!;
      const baseToken = baseTokens.find(t => t.address === market.baseAddress.toLowerCase())!;
      const boards = market.boards.map(board => {
        const strikes = board.strikes.map(strike => {
          const position = {
            type: ContractType.POSITION,
            appId,
            groupId,
            address: market.optionToken.id.toLowerCase(),
            network,
            displayProps: {
              images: [getAppImg(appId)],
            },
            dataProps: {},
          };
          const positions = _.keys(OPTION_TYPES).map(key => {
            return {
              ...position,
              tokens: Number(key) === 2 ? [supplied(baseToken), quoteToken] : [baseToken, supplied(quoteToken)],
              displayProps: {
                ...position.displayProps,
                label: `${OPTION_TYPES[key]} ${baseToken.symbol} @ $${strike.strikePriceReadable}`,
                secondaryLabel: `Option ${key} Strike ${strike.strikeId}`,
              },
            } as ContractPosition;
          });
          return positions;
        });
        return _.flatten(strikes);
      });
      return _.flatten(boards);
    });
    return _.flatten(markets);
  }
}
