import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BANCOR_V3_DEFINITION = appDefinition({
  id: 'bancor-v3',
  name: 'Bancor V3',
  description: 'Deposit a single token and maintain 100% upside exposure while earning fees and rewards',
  url: 'https://app.bancor.network/',
  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    bntPool: {
      id: 'bnt-pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farm',
    },
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {
    github: 'https://github.com/bancorprotocol',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(BANCOR_V3_DEFINITION.id)
export class BancorV3AppDefinition extends AppDefinition {
  constructor() {
    super(BANCOR_V3_DEFINITION);
  }
}

export default BANCOR_V3_DEFINITION;
