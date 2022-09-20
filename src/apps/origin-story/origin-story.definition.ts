import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ORIGIN_STORY_DEFINITION = appDefinition({
  id: 'origin-story',
  name: 'Origin Story',
  description: 'Origin Story is where top creators launch their NFTs',
  url: 'https://www.story.xyz',

  groups: {
    series: {
      id: 'series',
      type: GroupType.POSITION,
      label: 'Series',
    },
  },

  tags: [AppTag.FARMING, AppTag.NFT_MARKETPLACE, AppTag.STAKING],
  keywords: [],
  links: {
    discord: 'https://t.me/originprotocol',
    github: 'https://github.com/OriginProtocol',
    telegram: 'https://t.me/originprotocol',
    twitter: 'https://twitter.com/originprotocol',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ORIGIN_STORY_DEFINITION.id)
export class OriginStoryAppDefinition extends AppDefinition {
  constructor() {
    super(ORIGIN_STORY_DEFINITION);
  }
}

export default ORIGIN_STORY_DEFINITION;
