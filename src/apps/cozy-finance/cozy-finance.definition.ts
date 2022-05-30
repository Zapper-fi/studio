import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const COZY_FINANCE_DEFINITION = appDefinition({
  id: 'cozy-finance',
  name: 'Cozy Finance',
  description: 'Cozy is an autonomous protocol for protecting DeFi deposits.',
  url: 'https://www.cozy.finance/',

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Supply',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.TOKEN,
      label: 'Borrow',
    },
  },

  tags: [AppTag.INSURANCE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(COZY_FINANCE_DEFINITION.id)
export class CozyFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(COZY_FINANCE_DEFINITION);
  }
}

export default COZY_FINANCE_DEFINITION;
