import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const VAPORWAVE_FINANCE_DEFINITION = appDefinition({
  id: 'vaporwave-finance',
  name: 'Vaporwave Finance',
  description: 'Yield Optimizer on Aurora ',
  url: 'https://www.vaporwave.farm',

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.TOKEN,
      label: 'farm',
    },

    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'vault',
    },
  },

  tags: [AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(VAPORWAVE_FINANCE_DEFINITION.id)
export class VaporwaveFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(VAPORWAVE_FINANCE_DEFINITION);
  }
}

export default VAPORWAVE_FINANCE_DEFINITION;
