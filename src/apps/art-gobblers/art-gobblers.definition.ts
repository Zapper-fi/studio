import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ART_GOBBLERS_DEFINITION = appDefinition({
  id: 'art-gobblers',
  name: 'Art Gobblers',
  description: '',
  url: 'https://artgobblers.com/',

  groups: {
    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Claimable Goo',
    },
  },

  tags: [AppTag.NFT_MARKETPLACE],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/artgobblers',
    github: 'https://github.com/artgobblers',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(ART_GOBBLERS_DEFINITION.id)
export class ArtGobblersAppDefinition extends AppDefinition {
  constructor() {
    super(ART_GOBBLERS_DEFINITION);
  }
}

export default ART_GOBBLERS_DEFINITION;
