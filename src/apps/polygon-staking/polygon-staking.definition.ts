import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const POLYGON_STAKING_DEFINITION = appDefinition({
  id: 'polygon-staking',
  name: 'Polygon Staking',
  description:
    'Anyone can become a validator on the Polygon PoS mainnet and share the non-inflationary network rewards, supporting the next wave of adoption. ',
  url: 'https://polygon.technology/',
  groups: {
    deposit: {
      id: 'deposit',
      type: GroupType.POSITION,
      label: 'Deposits',
    },
  },
  tags: [AppTag.STAKING],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/0xPolygon',
    github: 'https://github.com/maticnetwork/',
    telegram: 'https://t.me/polygonofficial',
    twitter: 'https://twitter.com/0xPolygon',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(POLYGON_STAKING_DEFINITION.id)
export class PolygonStakingAppDefinition extends AppDefinition {
  constructor() {
    super(POLYGON_STAKING_DEFINITION);
  }
}

export default POLYGON_STAKING_DEFINITION;
