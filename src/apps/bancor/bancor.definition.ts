import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BANCOR_DEFINITION = appDefinition({
  id: 'bancor',
  name: 'bancor',
  description: 'Deposit a single token and maintain 100% upside exposure while earning fees and rewards',
  url: 'https://app.bancor.network/',
  groups: {
    v3Pool: {
      id: 'v3Pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
    v3Farm: {
      id: 'v3Farm',
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

@Register.AppDefinition(BANCOR_DEFINITION.id)
export class BancorAppDefinition extends AppDefinition {
  constructor() {
    super(BANCOR_DEFINITION);
  }
}

export default BANCOR_DEFINITION;
