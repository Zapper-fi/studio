import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const EULER_DEFINITION = appDefinition({
  id: 'euler',
  name: 'euler',
  description:
    'Euler is a non-custodial protocol on Ethereum that allows users to lend and borrow almost any crypto asset.',
  url: 'https://app.euler.finance/',

  groups: {
    eToken: {
      id: 'e-token',
      type: GroupType.TOKEN,
      label: 'E Token',
    },

    dToken: {
      id: 'd-token',
      type: GroupType.TOKEN,
      label: 'D Token',
    },

    pToken: {
      id: 'p-token',
      type: GroupType.TOKEN,
      label: 'P Token',
    },
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(EULER_DEFINITION.id)
export class EulerAppDefinition extends AppDefinition {
  constructor() {
    super(EULER_DEFINITION);
  }
}

export default EULER_DEFINITION;
