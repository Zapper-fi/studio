import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const POLYGON_DEFINITION = appDefinition({
  id: 'polygon',
  name: 'Polygon',
  description:
    'Polygon believes in Web3 for all. Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees without ever sacrificing on security.',
  url: 'https://polygon.technology/',
  groups: {
    staking: {
      id: 'staking',
      type: GroupType.POSITION,
      label: 'Staking',
    },
  },
  tags: [AppTag.STAKING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(POLYGON_DEFINITION.id)
export class PolygonAppDefinition extends AppDefinition {
  constructor() {
    super(POLYGON_DEFINITION);
  }
}

export default POLYGON_DEFINITION;
