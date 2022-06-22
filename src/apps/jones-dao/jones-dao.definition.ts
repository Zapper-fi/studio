import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const JONES_DAO_DEFINITION = appDefinition({
  id: 'jones-dao',
  name: 'Jones Dao',
  description: `Jones DAO is a yield, strategy, and liquidity protocol for options, with vaults that enable 1-click access to institutional-grade options strategies while unlocking liquidity and capital efficiency for DeFi options with yield-bearing options-backed asset tokens.`,
  url: 'https://jonesdao.io/',

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Staking',
      groupLabel: 'Farms',
    },

    millinerV2: {
      id: 'milliner-v2',
      type: GroupType.POSITION,
      label: 'Milliner V2',
    },

    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'Vault',
    },
  },

  tags: [AppTag.DERIVATIVES, AppTag.OPTIONS],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/jonesdao',
    github: 'https://github.com/Jones-DAO',
    twitter: 'https://twitter.com/DAOJonesOptions',
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(JONES_DAO_DEFINITION.id)
export class JonesDaoAppDefinition extends AppDefinition {
  constructor() {
    super(JONES_DAO_DEFINITION);
  }
}

export default JONES_DAO_DEFINITION;
