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
    plsDpx: {
      id: 'pls-dpx',
      type: GroupType.TOKEN,
      label: 'plsDPX',
    },

    plsJones: {
      id: 'pls-jones',
      type: GroupType.TOKEN,
      label: 'plsJONES',
    },

    lock: {
      id: 'lock',
      type: GroupType.POSITION,
      label: 'Locked PLS',
    },

    farmPlsDpxLp: {
      id: 'farm-pls-dpx-lp',
      type: GroupType.POSITION,
      label: 'plsDPX LP Farm',
    },

    farmPlsDpx: {
      id: 'farm-pls-dpx',
      type: GroupType.POSITION,
      label: 'plsDPX Farm',
    },

    farmPlsDpxV2: {
      id: 'farm-pls-dpx-v2',
      type: GroupType.POSITION,
      label: 'plsDPX Farm V2',
    },

    farmPlsJonesLp: {
      id: 'farm-pls-jones-lp',
      type: GroupType.POSITION,
      label: 'plsJONES LP Farm',
    },

    farmPlsJones: {
      id: 'farm-pls-jones',
      type: GroupType.POSITION,
      label: 'plsJONES Farm',
    },

    farmPls: {
      id: 'farm-pls',
      type: GroupType.POSITION,
      label: 'PLS Farm',
    },

    tgeClaimable: {
      id: 'tge-claimable',
      type: GroupType.POSITION,
      label: 'Private TGE Allocation',
    },
  },
  tags: [AppTag.ASSET_MANAGEMENT, AppTag.FARMING],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/plutusdao',
    twitter: 'https://twitter.com/PlutusDAO_io',
  },

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
