import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const TECTONIC_DEFINITION = appDefinition({
  id: 'tectonic',
  name: 'tectonic',
  description:
    'Tectonic is the first DeFi protocol designed to maximize capital efficiency, benefiting liquidity providers, traders, and borrowers.',
  url: 'https://tectonic.finance/',

  groups: {
    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Claimable',
    },

    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Supply',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Borrow',
    },
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#000024',
});

@Register.AppDefinition(TECTONIC_DEFINITION.id)
export class TectonicAppDefinition extends AppDefinition {
  constructor() {
    super(TECTONIC_DEFINITION);
  }
}

export default TECTONIC_DEFINITION;
