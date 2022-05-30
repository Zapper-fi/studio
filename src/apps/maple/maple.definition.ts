import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MAPLE_DEFINITION = appDefinition({
  id: 'maple',
  name: 'Maple',
  description: `Undercollateralized loans for institutional borrowers`,
  url: 'https://www.maple.finance/',

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },

    stakedBpt: {
      id: 'staked-bpt',
      type: GroupType.TOKEN,
      label: 'Staked BPT',
    },

    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    xMpl: {
      id: 'x-mpl',
      type: GroupType.TOKEN,
      label: 'xMPL',
    },
  },

  tags: [AppTag.LENDING],
  keywords: [],

  links: {
    github: 'https://github.com/maple-labs',
    twitter: 'https://twitter.com/maplefinance',
    medium: 'https://maplefinance.medium.com/',
    discord: 'https://discord.gg/Xy6sqxRhFG',
    telegram: 'https://t.me/maplefinance',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(MAPLE_DEFINITION.id)
export class MapleAppDefinition extends AppDefinition {
  constructor() {
    super(MAPLE_DEFINITION);
  }
}

export default MAPLE_DEFINITION;
