import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import _, { flattenDeep, omit } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { LyraAvalonViemContractFactory } from '../contracts';
import { LyraOptionToken } from '../contracts/viem';

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
  positionKey: string;
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
    @Inject(LyraAvalonViemContractFactory) protected readonly contractFactory: LyraAvalonViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.lyraOptionToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<LyraAvalonOptionTokenDefinition[]> {
    const response = await gqlFetch<OptionsResponse>({
      endpoint: 'https://subgraph.satsuma-prod.com/sw9vuxiQey3c/lyra/optimism-mainnet-newport/api',
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
      const quoteTokenDefinition = {
        metaType: MetaType.SUPPLIED,
        address: definition.quoteAddress,
        network: this.network,
      };
      return [quoteTokenDefinition];
    } else if (definition.optionType === 2) {
      // Short Call Base
      const quoteTokenDefinition = {
        metaType: MetaType.BORROWED,
        address: definition.quoteAddress,
        network: this.network,
      };
      const collateralTokenDefinition = {
        metaType: MetaType.SUPPLIED,
        address: definition.baseAddress,
        network: this.network,
      };
      return [quoteTokenDefinition, collateralTokenDefinition];
    } else {
      // Short Call Quote/Short Put Quote
      const quoteTokenDefinition = {
        metaType: MetaType.BORROWED,
        address: definition.quoteAddress,
        network: this.network,
      };
      const collateralTokenDefinition = {
        metaType: MetaType.SUPPLIED,
        address: definition.quoteAddress,
        network: this.network,
      };
      return [quoteTokenDefinition, collateralTokenDefinition];
    }
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<LyraOptionToken, LyraAvalonOptionContractPositionDataProps, LyraAvalonOptionTokenDefinition>) {
    return { ...omit(definition, 'address'), positionKey: `${definition.optionType}:${definition.strikeId}` };
  }

  async getLabel({
    definition,
    multicall,
  }: GetDisplayPropsParams<
    LyraOptionToken,
    LyraAvalonOptionContractPositionDataProps,
    LyraAvalonOptionTokenDefinition
  >) {
    const baseContract = this.appToolkit.globalViemContracts.erc20({
      address: definition.baseAddress,
      network: this.network,
    });
    const baseSymbol = await multicall.wrap(baseContract).read.symbol();
    const optionLabel = OPTION_TYPES[definition.optionType];
    return `${optionLabel} ${baseSymbol} @ $${definition.strikePriceReadable}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<LyraOptionToken, LyraAvalonOptionContractPositionDataProps>): Promise<BigNumberish[]> {
    // Extract information from contract position
    const { strikeId, optionType, callPrice, putPrice } = contractPosition.dataProps;

    // Find matching user position for contract position
    const ownerPositions = await contract.read.getOwnerPositions([address]);
    const userPosition = ownerPositions
      .filter(p => Number(p.strikeId) === strikeId)
      .find(p => p.optionType === optionType);
    if (!userPosition) return [];

    // Find amount of position
    const priceRaw = OPTION_TYPES[optionType].includes('Call') ? callPrice : putPrice;
    const price = priceRaw / 10 ** 18;
    const amountRaw = (
      (Number(price) * Number(userPosition.amount)) /
      10 ** (18 - contractPosition.tokens[0].decimals)
    ).toString();

    if (optionType === 0 || optionType === 1) return [amountRaw];

    const decimals =
      optionType == 2
        ? 10 ** (18 - contractPosition.tokens[1].decimals)
        : 10 ** (18 - contractPosition.tokens[0].decimals);
    const positionCollateral = BigNumber.from(userPosition.collateral).div(decimals);

    return [amountRaw, positionCollateral];
  }
}
