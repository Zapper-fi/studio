import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AURORA_PLUS_DEFINITION = appDefinition({
  id: 'aurora-plus',
  name: 'Aurora+',
  description:
    'Aurora+ is a membership program for users of Aurora that provides a suite of incredible benefits, including free transactions and staking rewards.',
  url: 'https://aurora.plus/',

  groups: {
    stake: {
      id: 'stake',
      type: GroupType.POSITION,
      label: 'Staked Aurora',
    },
  },

  tags: [AppTag.STAKING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(AURORA_PLUS_DEFINITION.id)
export class AuroraPlusAppDefinition extends AppDefinition {
  constructor() {
    super(AURORA_PLUS_DEFINITION);
  }
}

export default AURORA_PLUS_DEFINITION;
