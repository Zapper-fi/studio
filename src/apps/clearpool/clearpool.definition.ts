import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CLEARPOOL_DEFINITION = appDefinition({
  id: 'clearpool',
  name: 'Clearpool',
  description: 'Clearpool is a decentralized marketplace for unsecured institutional capital.',
  url: 'https://clearpool.finance',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pool',
    },
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(CLEARPOOL_DEFINITION.id)
export class ClearpoolAppDefinition extends AppDefinition {
  constructor() {
    super(CLEARPOOL_DEFINITION);
  }
}

export default CLEARPOOL_DEFINITION;
