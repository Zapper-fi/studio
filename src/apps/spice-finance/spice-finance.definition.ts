import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SPICE_FINANCE_DEFINITION = appDefinition({
  id: 'spice-finance',
  name: 'Spice Finance',
  description: `Spice Finance is an NFT lending aggregator that optimizes yield for lenders.`,
  url: 'https://www.spicefi.xyz/',
  tags: [AppTag.YIELD_AGGREGATOR],
  groups: {
    WETH: {
      id: 'weth',
      type: GroupType.TOKEN,
      label: 'WETH',
    },
  },
  links: {
    twitter: 'https://twitter.com/spice_finance',
    discord: 'https://discord.gg/spicefinance',
    github: 'https://github.com/teamspice',
    medium: 'https://spicefinance.medium.com',
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(SPICE_FINANCE_DEFINITION.id)
export class SpiceFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(SPICE_FINANCE_DEFINITION);
  }
}
