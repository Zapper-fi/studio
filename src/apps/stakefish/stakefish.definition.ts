import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const STAKEFISH_DEFINITION = appDefinition({
  id: 'stakefish',
  name: 'stakefish',
  description: 'Secure the Ethereum network and earn rewards.',
  url: 'https://stake.fish/',

  groups: {
    staking: {
      id: 'staking',
      type: GroupType.POSITION,
      label: 'Staking',
    },
  },

  tags: [AppTag.INFRASTRUCTURE, AppTag.STAKING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(STAKEFISH_DEFINITION.id)
export class StakefishAppDefinition extends AppDefinition {
  constructor() {
    super(STAKEFISH_DEFINITION);
  }
}

export default STAKEFISH_DEFINITION;
