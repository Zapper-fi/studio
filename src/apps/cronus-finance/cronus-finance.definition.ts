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
    jar: {
      id: 'jar',
      type: GroupType.TOKEN,
      label: 'Jars',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },

  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.EVMOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: 'rgb(255, 240, 231)',
});

@Register.AppDefinition(CRONUS_FINANCE_DEFINITION.id)
export class CronusFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(CRONUS_FINANCE_DEFINITION);
  }
}

export default CRONUS_FINANCE_DEFINITION;
