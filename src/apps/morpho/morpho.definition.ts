import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MORPHO_DEFINITION = appDefinition({
  id: 'morpho',
  name: 'Morpho',
  description: 'TODO',
  url: 'https://app.morpho.xyz',

  groups: {
    morphoCompoundSupply: {
      id: 'morpho-compound-supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },
    morphoCompoundBorrow: {
      id: 'morpho-compound-borrow',
      type: GroupType.POSITION,
      label: 'Lending',
    },
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {
    github: 'https://github.com/morpho-dao',
    discord: 'https://discord.com/invite/uB7vaJ4JGs/',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#0074ff',
});

@Register.AppDefinition(MORPHO_DEFINITION.id)
export class MorphoAppDefinition extends AppDefinition {
  constructor() {
    super(MORPHO_DEFINITION);
  }
}

export default MORPHO_DEFINITION;
