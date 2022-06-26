import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const DHEDGE_V_2_DEFINITION = appDefinition({
  id: 'dhedge-v2',
  name: 'dHEDGE V2',
  description: 'Non-custodial, decentralized, social asset management on EVM chains.',
  url: 'https://www.dhedge.org/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
  },

  tags: [AppTag.ASSET_MANAGEMENT],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(DHEDGE_V_2_DEFINITION.id)
export class DhedgeV2AppDefinition extends AppDefinition {
  constructor() {
    super(DHEDGE_V_2_DEFINITION);
  }
}

export default DHEDGE_V_2_DEFINITION;
