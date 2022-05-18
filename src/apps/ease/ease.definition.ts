import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const EASE_DEFINITION = appDefinition({
  id: 'ease',
  name: 'ease DeFi cover',
  description:
    'ease provides users with a DeFi native coverage model that protects them from hacks by pooling covered assets together and using them as collateral for the coverage.',
  url: 'https://ease.org/',

  groups: {
    rca: {
      id: 'rca',
      type: GroupType.TOKEN,
      label: 'RCAs',
    },
  },

  tags: [AppTag.INSURANCE, AppTag.YIELD_AGGREGATOR],
  keywords: [],

  links: {
    learn: '',
    github: '',
    twitter: '',
    telegram: '',
    discord: '',
    medium: '',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(EASE_DEFINITION.id)
export class EaseAppDefinition extends AppDefinition {
  constructor() {
    super(EASE_DEFINITION);
  }
}

export default EASE_DEFINITION;
