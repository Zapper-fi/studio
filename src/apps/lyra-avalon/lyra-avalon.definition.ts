import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LYRA_AVALON_DEFINITION = appDefinition({
  id: 'lyra-avalon',
  name: 'Lyra Avalon',
  description:
    'Lyra is an options trading protocol accessing the scalability of Layer 2 Ethereum to provide a robust, lightning-fast and reliable trading experience.',
  url: 'https://avalon.app.lyra.finance/',

  groups: {
    options: {
      id: 'options',
      type: GroupType.POSITION,
      label: 'Options',
    },

    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Liquidity Pool',
      groupLabel: 'Pools',
    },

    staking: {
      id: 'staking',
      type: GroupType.TOKEN,
      label: 'Staking',
      groupLabel: 'Farms',
    },

    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Rewards',
    },
  },

  tags: [AppTag.OPTIONS],
  keywords: [],

  links: {
    discord: 'https://discord.com/invite/P49mj6UbmC',
    github: 'https://github.com/lyra-finance',
  },

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(LYRA_AVALON_DEFINITION.id)
export class LyraAvalonAppDefinition extends AppDefinition {
  constructor() {
    super(LYRA_AVALON_DEFINITION);
  }
}

export default LYRA_AVALON_DEFINITION;
