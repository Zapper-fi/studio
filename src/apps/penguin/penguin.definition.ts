import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PENGUIN_DEFINITION = appDefinition({
  id: 'penguin',
  name: 'Penguin Finance',
  description: `Penguin Finance helps you maximize your yield through a full-fledged ecosystem with yield-aggregation, farming, staking, fundraising, and gaming dApps. It's basically DeFi on steroids.`,
  url: 'https://penguinfinance.org/',

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'Compounder Vaults',
      groupLabel: 'Farms',
    },
    vaultClaimable: {
      id: 'vault',
      type: GroupType.POSITION,
      label: 'Compounder Claimable xPEFI',
    },
    iPefi: {
      id: 'i-pefi',
      type: GroupType.TOKEN,
      label: 'iPEFI',
    },
    xPefi: {
      id: 'x-pefi',
      type: GroupType.TOKEN,
      label: 'xPEFI',
    },
    chefV1Farm: {
      id: 'chef-v1-farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
    chefV2Farm: {
      id: 'chef-v2-farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },

  tags: [AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(PENGUIN_DEFINITION.id)
export class PenguinAppDefinition extends AppDefinition {
  constructor() {
    super(PENGUIN_DEFINITION);
  }
}

export default PENGUIN_DEFINITION;
