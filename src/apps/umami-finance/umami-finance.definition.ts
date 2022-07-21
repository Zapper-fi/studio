import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const UMAMI_FINANCE_DEFINITION = appDefinition({
  id: 'umami-finance',
  name: 'Umami Finance',
  description:
    'Umami’s expanding menu of strategy vaults and staking options offers sustainable, risk-hedged passive income in WETH and USDC sourced from across Arbitrum’s DeFi ecosystem.',
  url: 'https://umami.finance/',

  groups: {
    marinate: {
      id: 'marinate',
      type: GroupType.TOKEN,
      label: 'Marinate',
    },
    compound: {
      id: 'compound',
      type: GroupType.TOKEN,
      label: 'Compound',
    },
  },

  tags: [AppTag.FUND_MANAGER, AppTag.ASSET_MANAGEMENT],
  keywords: [],

  links: {
    github: 'https://github.com/orgs/Arbi-s/repositories',
    twitter: 'https://twitter.com/UmamiFinance',
    telegram: '',
    discord: 'https://discord.gg/8SrKEXF8',
    medium: 'https://umamifinance.medium.com/',
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(UMAMI_FINANCE_DEFINITION.id)
export class UmamiFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(UMAMI_FINANCE_DEFINITION);
  }
}

export default UMAMI_FINANCE_DEFINITION;
