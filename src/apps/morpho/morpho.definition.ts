import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MORPHO_DEFINITION = appDefinition({
  id: 'morpho',
  name: 'Morpho',
  description:
    'Morpho is an on-chain peer-to-peer layer on top of lending pools. Rates are seamlessly improved for borrowers and lenders while preserving the same guarantees.',
  url: 'https://app.morpho.xyz',

  groups: {
    morphoCompound: {
      id: 'morpho-compound',
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

  primaryColor: '#14183D',
});

@Register.AppDefinition(MORPHO_DEFINITION.id)
export class MorphoAppDefinition extends AppDefinition {
  constructor() {
    super(MORPHO_DEFINITION);
  }
}

export default MORPHO_DEFINITION;
