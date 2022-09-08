import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MANIFOLD_FINANCE_DEFINITION = appDefinition({
  id: 'manifold-finance',
  name: 'Manifold Finance',
  description: 'Making the connections to protocols and people for DeFi opportunities.',
  url: 'https://www.manifoldfinance.com/',

  groups: {
    staking: {
      id: 'staking',
      type: GroupType.TOKEN,
      label: 'Staking',
    },
  },

  tags: [AppTag.INFRASTRUCTURE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(MANIFOLD_FINANCE_DEFINITION.id)
export class ManifoldFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(MANIFOLD_FINANCE_DEFINITION);
  }
}

export default MANIFOLD_FINANCE_DEFINITION;
