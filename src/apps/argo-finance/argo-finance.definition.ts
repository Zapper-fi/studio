import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ARGO_FINANCE_DEFINITION = appDefinition({
  id: 'argo-finance',
  name: 'Argo Finance',
  description:
    'Argo is the premier liquid staking protocol built on top of the Cronos blockchain that aims to unlock the value of all staked CRO and maximize the capital efficiency of CRO across the Crypto.com ecosystem.',
  url: 'https://www.argofinance.money/',

  groups: {
    pledging: {
      id: 'pledging',
      type: GroupType.POSITION,
      label: 'Pledging',
    },

    xArgo: {
      id: 'x-argo',
      type: GroupType.TOKEN,
      label: 'x-argo',
    },
  },

  tags: [AppTag.LIQUID_STAKING],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/ArgoProtocol',
    telegram: 'https://t.me/Argo_Finance',
    discord: 'https://discord.com/invite/argofinance',
    medium: 'https://argofinance.medium.com/',
  },

  supportedNetworks: {
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ARGO_FINANCE_DEFINITION.id)
export class ArgoFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(ARGO_FINANCE_DEFINITION);
  }
}

export default ARGO_FINANCE_DEFINITION;
