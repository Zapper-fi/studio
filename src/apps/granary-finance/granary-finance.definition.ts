import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GRANARY_FINANCE_DEFINITION = appDefinition({
  id: 'granary-finance',
  name: 'The Granary',
  description: 'The Granary is a decentralized, user-driven borrowing and lending liquidity market inspired by AAVE.',
  url: 'https://granary.finance/',

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    stableDebt: {
      id: 'stable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    variableDebt: {
      id: 'variable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.HARMONY_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(GRANARY_FINANCE_DEFINITION.id)
export class GranaryFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(GRANARY_FINANCE_DEFINITION);
  }
}

export default GRANARY_FINANCE_DEFINITION;
