import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HELIO_DEFINITION = appDefinition({
  id: 'helio',
  name: 'Helio',
  description: 'The revolutionary stable asset backed by BNB',
  url: 'https://helio.money',

  groups: {
    tokens: {
      id: 'tokens',
      type: GroupType.TOKEN,
      label: 'Token',
    },

    staking: {
      id: 'staking',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },

  tags: [AppTag.COLLATERALIZED_DEBT_POSITION],
  keywords: [],

  links: {
    github: 'https://github.com/helio-money',
    twitter: 'https://twitter.com/Helio_Money',
    discord: 'https://discord.gg/k5JZVQYpUn',
    telegram: 'https://t.me/helio_money',
    medium: 'https://medium.com/@Helio-HAY',
  },

  supportedNetworks: {
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#ffd600',
});

@Register.AppDefinition(HELIO_DEFINITION.id)
export class HelioAppDefinition extends AppDefinition {
  constructor() {
    super(HELIO_DEFINITION);
  }
}

export default HELIO_DEFINITION;
