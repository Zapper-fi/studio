import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LOOKS_RARE_DEFINITION = appDefinition({
  id: 'looks-rare',
  name: 'LooksRare',
  description: `LooksRare is the community-first NFT marketplace with rewards for participating.`,
  url: 'https://looksrare.org/',

  tags: [AppTag.NFT_MARKETPLACE],

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    compounder: {
      id: 'compounder',
      type: GroupType.POSITION,
      label: 'Compounder',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  links: {
    github: 'https://github.com/LooksRare',
    twitter: 'https://mobile.twitter.com/looksrare',
  },
});

@Register.AppDefinition(LOOKS_RARE_DEFINITION.id)
export class LooksRareAppDefinition extends AppDefinition {
  constructor() {
    super(LOOKS_RARE_DEFINITION);
  }
}
