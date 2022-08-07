import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const REVERT_FINANCE_DEFINITION = appDefinition({
  id: 'revert-finance',
  name: 'Revert finance',
  description: 'Revert develops analytics and management tools for liquidity providers in AMM protocols. ',
  url: 'https://revert.finance/',

  groups: {
    compoundorBotRewards: {
      id: 'compoundor-bot-rewards',
      type: GroupType.POSITION,
      label: 'Compoundor bot rewards',
    },
  },

  tags: [AppTag.ASSET_MANAGEMENT],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(REVERT_FINANCE_DEFINITION.id)
export class RevertFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(REVERT_FINANCE_DEFINITION);
  }
}

export default REVERT_FINANCE_DEFINITION;
