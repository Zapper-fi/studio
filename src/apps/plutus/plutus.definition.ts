import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PLUTUS_DEFINITION = appDefinition({
  id: 'plutus',
  name: 'PlutusDAO',
  description:
    'Plutus is a governance aggregator with the goal of amassing governance power in the Dopex/Jones ecosystem through the capture of veDPX and veJONES',
  url: 'https://plutusdao.io/',
  groups: {
    ve: {
      id: 've',
      type: GroupType.TOKEN,
      label: 'veTokens',
    },
    pools: {
      id: 'pools',
      type: GroupType.POSITION,
      label: 'Pools',
    },
  },
  tags: [AppTag.ASSET_MANAGEMENT, AppTag.FARMING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(PLUTUS_DEFINITION.id)
export class PlutusAppDefinition extends AppDefinition {
  constructor() {
    super(PLUTUS_DEFINITION);
  }
}

export default PLUTUS_DEFINITION;
