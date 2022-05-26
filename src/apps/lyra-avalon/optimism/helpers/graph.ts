import { gql } from 'graphql-request';

import { TheGraphHelper } from '~app-toolkit/helpers/the-graph/the-graph.helper';


type OptionPrice = {
  latestOptionPriceAndGreeks: {
    optionPrice: string
  }
}
type OptionsResponse = {
  markets: {
    id: string;
    optionToken: {
      id: string
    }
    baseAddress: string;
    quoteAddress: string,
    boards: {
      strikes: {
        strikeId: string;
        strikePriceReadable: string;
        putOption: OptionPrice,
        callOption: OptionPrice,
      }[]
    }[]
  }[]
}
const OPTIONS_QUERY = gql`
{
  markets(where:{isRemoved:false}) {
    id
    baseAddress
    quoteAddress
    optionToken {
      id
    }
    boards (where: {isExpired:false}) {
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
}`
const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/lyra-finance/mainnet'

export const runQuery = <T>(graphHelper: TheGraphHelper, query) => {
  return graphHelper.requestGraph<T>({
    endpoint: subgraphUrl,
    query,
  });
};

export const getOptions = (graphHelper: TheGraphHelper) => {
  return runQuery<OptionsResponse>(graphHelper, OPTIONS_QUERY)
};