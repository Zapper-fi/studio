import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MEAN_FINANCE_DEFINITION = appDefinition({
  id: 'mean-finance',
  name: 'Mean Finance',
  description:
    'Our protocol enables users to Dollar Cost Average (DCA) any ERC20 into any ERC20 with their preferred period frequency.',
  url: 'https://mean.finance',

  groups: {
    dcaPosition: {
      id: 'dca-position',
      type: GroupType.POSITION,
      label: 'DCA Position',
    },
  },

  tags: [AppTag.ASSET_MANAGEMENT, AppTag.CROSS_CHAIN, AppTag.PREDICTION_MARKET],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#3076F6',
});

@Register.AppDefinition(MEAN_FINANCE_DEFINITION.id)
export class MeanFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(MEAN_FINANCE_DEFINITION);
  }
}

export default MEAN_FINANCE_DEFINITION;
