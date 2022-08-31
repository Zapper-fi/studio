import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CRONUS_FINANCE_DEFINITION = appDefinition({
  id: 'cronus-finance',
  name: 'Cronus Finance',
  description: 'Cronus Finance is a DEX on Evmos network',
  url: 'https://cronusfinancexyz.com',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },

  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  keywords: [],
  links: {
    github: 'https://github.com/cronus-finance',
    twitter: 'https://twitter.com/cronusfinance',
    discord: 'https://discord.com/invite/cronusfinance',
  },

  supportedNetworks: {
    [Network.EVMOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff0e7',
});

@Register.AppDefinition(CRONUS_FINANCE_DEFINITION.id)
export class CronusFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(CRONUS_FINANCE_DEFINITION);
  }
}

export default CRONUS_FINANCE_DEFINITION;
