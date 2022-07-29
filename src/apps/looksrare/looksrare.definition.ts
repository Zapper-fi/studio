import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LOOKSRARE_DEFINITION = appDefinition({
  id: 'looksrare',
  name: 'looksrare',
  description:
    'LooksRare is the community-first NFT marketplace that actively rewards traders, collectors and creators for participating.',
  url: 'https://looksrare.org/',

  groups: {
    autocompounding: {
      id: 'autocompounding',
      type: GroupType.TOKEN,
      label: 'autocompounding',
    },

    standard: {
      id: 'standard',
      type: GroupType.TOKEN,
      label: 'standard',
    },
  },

  tags: [AppTag.NFT_MARKETPLACE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(LOOKSRARE_DEFINITION.id)
export class LooksrareAppDefinition extends AppDefinition {
  constructor() {
    super(LOOKSRARE_DEFINITION);
  }
}

export default LOOKSRARE_DEFINITION;
