import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ARBOR_FINANCE_DEFINITION = appDefinition({
  id: 'arbor-finance',
  name: 'Arbor Finance',
  description: 'Arbor allows DAOs and other on-chain entities to obtain financing by selling long-term debt.',
  url: 'https://app.arbor.finance/offerings',

  groups: {
    arborFinance: {
      id: 'arbor-finance',
      type: GroupType.TOKEN,
      label: 'Bonds',
    },
  },

  tags: [AppTag.BONDS],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ARBOR_FINANCE_DEFINITION.id)
export class ArborFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(ARBOR_FINANCE_DEFINITION);
  }
}
