import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SEALIGHTSWAP_DEFINITION = appDefinition({
  id: 'sealightswap',
  name: 'sealightswap',
  description: 'Decentralized Exchange on Polygon Network',
  url: 'https://sealightswap.org',

  groups: {
    sealightswap: {
      id: 'sealightswap',
      type: GroupType.TOKEN,
      label: 'decentralized exchange',
    },
  },

  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(SEALIGHTSWAP_DEFINITION.id)
export class SealightswapAppDefinition extends AppDefinition {
  constructor() {
    super(SEALIGHTSWAP_DEFINITION);
  }
}

export default SEALIGHTSWAP_DEFINITION;
