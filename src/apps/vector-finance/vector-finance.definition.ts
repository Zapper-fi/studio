import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const VECTOR_FINANCE_DEFINITION = appDefinition({
  id: 'vector-finance',
  name: 'Vector Finance',
  description:
    'Vector allows users to deposit stablecoins and LP tokens to earn boosted yield from the Platypus and Trader Joe platforms, without having to stake their PTP/JOE.',
  url: 'https://vectorfinance.io/',
  tags: [AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/vectorfinance',
    github: 'https://github.com/vector-finance',
    twitter: 'https://twitter.com/vector_fi',
    medium: 'https://vectorfinance.medium.com/',
  },

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'farm',
    },
  },

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(VECTOR_FINANCE_DEFINITION.id)
export class VectorFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(VECTOR_FINANCE_DEFINITION);
  }
}

export default VECTOR_FINANCE_DEFINITION;
