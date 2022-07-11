import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SINGLE_DEFINITION = appDefinition({
  id: 'single',
  name: 'Single Finance',
  description:
    'Single Finance is a super intuitive platform for all your DeFi investments, minimizing correlations with the general market. Our signature strategy is a pseudo-market-neutral strategy. Everything here, including capital protection and return calculation, is worked out from your injected capital in USD. Everything is visualized. And everything is at your fingertips. We also launched LP Time Machine, a performance analytics tool for liquidity pools across all EVM compatible chains. The tool shows the full breakdown of backward-simulated P & L (based on capital marked to USD), including LP rewards, DEX reward tokens, and value change due to the price impact.',
  url: 'https://app.singlefinance.io/',

  groups: {
    lending: {
      id: 'lending',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    lyf: {
      id: 'lyf',
      type: GroupType.TOKEN,
      label: 'LYF',
    },
  },

  tags: [AppTag.FARMING, AppTag.STAKING, AppTag.YIELD_AGGREGATOR, AppTag.CROSS_CHAIN, AppTag.LENDING],

  keywords: [],
  links: {
    twitter: 'https://twitter.com/single_finance',
    discord: 'https://discord.com/invite/97W57CjJme',
  },

  supportedNetworks: {
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#7480FF',
});

@Register.AppDefinition(SINGLE_DEFINITION.id)
export class SingleAppDefinition extends AppDefinition {
  constructor() {
    super(SINGLE_DEFINITION);
  }
}

export default SINGLE_DEFINITION;
