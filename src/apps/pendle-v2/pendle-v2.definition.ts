import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PENDLE_V_2_DEFINITION = appDefinition({
  id: 'pendle-v2',
  name: 'Pendle',
  description:
    'The Pendle protocol enables the permissionless tokenization and trading of yield.Pendle allows anyone to purchase assets at a discount, obtain fixed yield, or long DeFi yield.',
  url: 'https://www.pendle.finance/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    yieldToken: {
      id: 'yield-token',
      type: GroupType.TOKEN,
      label: 'YT',
    },

    principalToken: {
      id: 'principal-token',
      type: GroupType.TOKEN,
      label: 'PT',
    },

    standardizedYieldToken: {
      id: 'standardized-yield-token',
      type: GroupType.TOKEN,
      label: 'SY',
    },
  },

  tags: [AppTag.DERIVATIVES],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/pendle_fi',
    discord: 'https://pendle.finance/discord',
    telegram: 'http://t.me/pendlefinance',
    medium: 'https://pendle.medium.com/',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(PENDLE_V_2_DEFINITION.id)
export class PendleV2AppDefinition extends AppDefinition {
  constructor() {
    super(PENDLE_V_2_DEFINITION);
  }
}
