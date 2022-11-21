import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ATLENDIS_V_1_DEFINITION = appDefinition({
  id: 'atlendis-v1',
  name: 'Atlendis',
  description: 'Atlendis is a capital-efficient DeFi lending protocol that enables crypto loans without collateral',
  url: 'https://app.atlendis.io/',

  groups: {
    lending: {
      id: 'lending',
      type: GroupType.POSITION,
      label: 'Lending',
    },
  },

  tags: [AppTag.BONDS, AppTag.LENDING],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/amDA5Rzk5r',
    medium: 'https://medium.com/@atlendis',
    twitter: 'https://twitter.com/AtlendisLabs',
  },

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ATLENDIS_V_1_DEFINITION.id)
export class AtlendisV1AppDefinition extends AppDefinition {
  constructor() {
    super(ATLENDIS_V_1_DEFINITION);
  }
}

export default ATLENDIS_V_1_DEFINITION;
