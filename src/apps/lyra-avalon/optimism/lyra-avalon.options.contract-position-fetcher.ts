import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import _, { flattenDeep, omit } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { LyraAvalonContractFactory, LyraOptionToken } from '../contracts';

const OPTION_TYPES = {
  0: 'Long Call',
  1: 'Long Put',
  2: 'Short Call Base',
  3: 'Short Call Quote',
  4: 'Short Put Quote',
};

type OptionsResponse = {
  markets: {
    id: string;
    optionToken: {
      id: string;
    };
    baseAddress: string;
    quoteAddress: string;
    boards: {
      strikes: {
        strikeId: string;
        strikePriceReadable: string;
        putOption: {
          latestOptionPriceAndGreeks: {
            optionPrice: string;
          };
        };
        callOption: {
          latestOptionPriceAndGreeks: {
            optionPrice: string;
          };
        };
      }[];
    }[];
  }[];
};
const OPTIONS_QUERY = gql`
  {
    markets(where: { isRemoved: false }) {
      id
      baseAddress
      quoteAddress
      optionToken {
        id
      }
      boards(where: { isExpired: false }) {
        boardId
        strikes {
          strikeId
          strikePriceReadable
          putOption {
            latestOptionPriceAndGreeks {
              optionPrice
            }
          }
          callOption {
            latestOptionPriceAndGreeks {
              optionPrice
            }
          }
        }
      }
    }
  }
`;

export interface LyraAvalonOptionContractPositionDataProps extends DefaultDataProps {
  optionType: number;
  strikeId: number;
  marketAddress: string;
  baseAddress: string;
  quoteAddress: string;
  tokenAddress: string;
  callPrice: number;
  putPrice: number;
  strikePriceReadable: string;
}

export type LyraAvalonOptionTokenDefinition = {
  address: string;
  optionType: number;
  strikeId: number;
  marketAddress: string;
  baseAddress: string;
  quoteAddress: string;
  tokenAddress: string;
  callPrice: number;
  putPrice: number;
  strikePriceReadable: string;
};

@PositionTemplate()
export class OptimismLyraAvalonOptionsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  LyraOptionToken,
  LyraAvalonOptionContractPositionDataProps,
  LyraAvalonOptionTokenDefinition
> {
  groupLabel = 'Options';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) protected readonly contractFactory: LyraAvalonContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LyraOptionToken {
    return this.contractFactory.lyraOptionToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<LyraAvalonOptionTokenDefinition[]> {
    const response = await this.appToolkit.helpers.theGraphHelper.request<OptionsResponse>({
      endpoint: 'https://subgraph.satsuma-prod.com/lyra/optimism-mainnet/api',
      query: OPTIONS_QUERY,
    });

    const definitions = response.markets.map(market => {
      return market.boards.map(board => {
        return board.strikes.map(strike => {
          return _.keys(OPTION_TYPES).map(key => ({
            address: market.optionToken.id,
            strikeId: Number(strike.strikeId),
            optionType: Number(key),
            marketAddress: market.id,
            baseAddress: market.baseAddress,
            quoteAddress: market.quoteAddress,
            tokenAddress: market.optionToken.id,
            callPrice: Number(strike.callOption.latestOptionPriceAndGreeks.optionPrice),
            putPrice: Number(strike.putOption.latestOptionPriceAndGreeks.optionPrice),
            strikePriceReadable: strike.strikePriceReadable,
          }));
        });
      });
    });

    return flattenDeep(definitions);
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<LyraOptionToken, LyraAvalonOptionTokenDefinition>) {
    // 0: [supplied(quote)]
    // 1: [supplied(quote)]
    // 2: [borrowed(quote)), collateral(base)]
    // 3: [borrowed(quote)), collateral(quote)]
    // 4: [borrowed(quote)), collateral(quote)]

    if (definition.optionType === 0 || definition.optionType === 1) {
      // Long Call/Long Put
      const quoteTokenDefinition = { metaType: MetaType.SUPPLIED, address: definition.quoteAddress };
      return [quoteTokenDefinition];
    } else if (definition.optionType === 2) {
      // Short Call Base
      const quoteTokenDefinition = { metaType: MetaType.BORROWED, address: definition.quoteAddress };
      const collateralTokenDefinition = { metaType: MetaType.SUPPLIED, address: definition.baseAddress };
      return [quoteTokenDefinition, collateralTokenDefinition];
    } else {
      // Short Call Quote/Short Put Quote
      const quoteTokenDefinition = { metaType: MetaType.BORROWED, address: definition.quoteAddress };
      const collateralTokenDefinition = { metaType: MetaType.SUPPLIED, address: definition.quoteAddress };
      return [quoteTokenDefinition, collateralTokenDefinition];
    }
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<LyraOptionToken, LyraAvalonOptionContractPositionDataProps, LyraAvalonOptionTokenDefinition>) {
    return omit(definition, 'address');
  }

  async getLabel({
    definition,
    multicall,
  }: GetDisplayPropsParams<
    LyraOptionToken,
    LyraAvalonOptionContractPositionDataProps,
    LyraAvalonOptionTokenDefinition
  >) {
    const baseContract = this.contractFactory.erc20({ address: definition.baseAddress, network: this.network });
    const baseSymbol = await multicall.wrap(baseContract).symbol();
    const optionLabel = OPTION_TYPES[definition.optionType];
    return `${optionLabel} ${baseSymbol} @ $${definition.strikePriceReadable}`;
  }

  getKey({
    contractPosition,
  }: {
    contractPosition: ContractPosition<LyraAvalonOptionContractPositionDataProps>;
  }): string {
    return this.appToolkit.getPositionKey(contractPosition, ['optionType', 'strikeId']);
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<LyraOptionToken, LyraAvalonOptionContractPositionDataProps>): Promise<BigNumberish[]> {
    // Extract information from contract position
    const { strikeId, optionType, callPrice, putPrice } = contractPosition.dataProps;

    // Find matching user position for contract position
    const ownerPositions = await contract.getOwnerPositions(address);
    const userPosition = ownerPositions
      .filter(p => Number(p.strikeId) === strikeId)
      .find(p => p.optionType === optionType);
    if (!userPosition) return [];

    // Find amount of position
    const quoteToken = contractPosition.tokens[0];
    const price = OPTION_TYPES[optionType].includes('Call') ? callPrice : putPrice;
    const amountRaw = ((Number(price) * Number(userPosition.amount)) / 10 ** quoteToken.decimals).toString();

    if (optionType === 0 || optionType === 1) return [amountRaw];
    return [amountRaw, userPosition.collateral];
  }
}
