import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const EASE_DEFINITION = appDefinition({
  id: 'ease',
  name: 'Ease DeFi Cover',
  description:
    'Ease is a decentralized insurance protocol that enables users to insure their yield, lending or LP tokens trustlessly and without a premium',
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
    discord: 'https://discord.gg/9JVTdFXdgF',
    github: 'https://github.com/EaseDeFi',
    learn: 'https://ease.org/learn/',
    twitter: 'https://twitter.com/EaseDeFi',
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
