import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CONCENTRATOR_DEFINITION = appDefinition({
  id: 'concentrator',
  name: 'Concentrator',
  description: 'Boost your Convex yields by ~50%',
  url: 'https://concentrator.aladdin.club/',

  groups: {
    acrv: {
      id: 'acrv',
      type: GroupType.TOKEN,
      label: 'aCRV',
    },

    afxs: {
      id: 'afxs',
      type: GroupType.TOKEN,
      label: 'aFXS',
    },

    poolcrv: {
      id: 'poolcrv',
      type: GroupType.POSITION,
      label: 'aCRV Vaults',
    },

    poollegacy: {
      id: 'poollegacy',
      type: GroupType.POSITION,
      label: 'Legacy Vaults',
    },

    poolfxs: {
      id: 'poolfxs',
      type: GroupType.POSITION,
      label: 'aFXS Vaults',
    },

    ve: {
      id: 've',
      type: GroupType.POSITION,
      label: 'Voting Escrow',
    },
  },

  tags: [AppTag.FARMING],
  keywords: [],

  links: {
    github: 'https://github.com/AladdinDAO',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(CONCENTRATOR_DEFINITION.id)
export class ConcentratorAppDefinition extends AppDefinition {
  constructor() {
    super(CONCENTRATOR_DEFINITION);
  }
}

export default CONCENTRATOR_DEFINITION;
