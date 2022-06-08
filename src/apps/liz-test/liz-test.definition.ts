import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LIZ_TEST_DEFINITION = appDefinition({
  id: 'liz-test',
  name: 'liz-test',
  description:
    'Pickle is cross-chain a yield aggregator application that uses vaults to auto-compound yield of your underlying tokens.',
  url: 'https://www.pickle.finance/',

  groups: {
    jar: {
      id: 'jar',
      type: GroupType.TOKEN,
      label: 'Jars',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },

  tags: [
    AppTag.ALGORITHMIC_STABLECOIN,
    AppTag.ASSET_MANAGEMENT,
    AppTag.BONDS,
    AppTag.BRIDGE,
    AppTag.COLLATERALIZED_DEBT_POSITION,
    AppTag.CROSS_CHAIN,
    AppTag.DECENTRALIZED_EXCHANGE,
    AppTag.DERIVATIVES,
    AppTag.ELASTIC_FINANCE,
    AppTag.FARMING,
    AppTag.FUND_MANAGER,
    AppTag.GAMING,
    AppTag.INFRASTRUCTURE,
    AppTag.INSURANCE,
    AppTag.LAUNCHPAD,
    AppTag.LENDING,
    AppTag.LIQUIDITY_POOL,
    AppTag.LIQUID_STAKING,
    AppTag.LOTTERY,
    AppTag.MARGIN_TRADING,
    AppTag.NFT_LENDING,
    AppTag.NFT_MARKETPLACE,
    AppTag.OPTIONS,
    AppTag.PAYMENTS,
    AppTag.PERPETUALS_EXCHANGE,
    AppTag.PREDICTION_MARKET,
    AppTag.PRIVACY,
    AppTag.REAL_ESTATE,
    AppTag.RESERVE_CURRENCY,
    AppTag.STABLECOIN,
    AppTag.STAKING,
    AppTag.SYNTHETICS,
    AppTag.TOKENIZED_RISK,
    AppTag.YIELD_AGGREGATOR,
    AppTag.LIMIT_ORDER,
  ],

  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.CELO_MAINNET]: [AppAction.VIEW],
    [Network.HARMONY_MAINNET]: [AppAction.VIEW],
    [Network.MOONRIVER_MAINNET]: [AppAction.VIEW],
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
    [Network.EVMOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(LIZ_TEST_DEFINITION.id)
export class LizTestAppDefinition extends AppDefinition {
  constructor() {
    super(LIZ_TEST_DEFINITION);
  }
}

export default LIZ_TEST_DEFINITION;
