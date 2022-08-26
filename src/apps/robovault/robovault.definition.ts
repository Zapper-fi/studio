import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ROBO_VAULT_DEFINITION = appDefinition({
  id: 'robovault',
  name: 'RoboVault',
  description: 'Single Asset Yield Farming',
  url: 'https://robo-vault.com/',

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'vault',
    },
  },

  tags: [AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/robo_vault',
    discord: 'https://discord.com/invite/PqTQn5zM56',
  },

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ROBO_VAULT_DEFINITION.id)
export class RoboVaultAppDefinition extends AppDefinition {
  constructor() {
    super(ROBO_VAULT_DEFINITION);
  }
}

export default ROBO_VAULT_DEFINITION;
