import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const IQ_DEFINITION = appDefinition({
  id: 'iq',
  name: 'IQ',
  description: 'The worlds largest blockchain and crypto encyclopedia',
  url: 'https://iq.wiki/',

  groups: {
    hiiq: {
      id: 'hiiq',
      type: GroupType.POSITION,
      label: 'HiIQ',
    },
  },

  tags: [AppTag.BRIDGE, AppTag.STAKING],
  keywords: [],
  links: {
    github: 'https://github.com/EveripediaNetwork',
    twitter: 'https://twitter.com/everipedia/',
    telegram: 'https://t.me/everipedia',
    discord: 'https://discord.com/invite/x9EWvTcPXt',
    Reddit: 'https://www.reddit.com/r/Everipedia/',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#ff5caa',
});

@Register.AppDefinition(IQ_DEFINITION.id)
export class IqAppDefinition extends AppDefinition {
  constructor() {
    super(IQ_DEFINITION);
  }
}

export default IQ_DEFINITION;
