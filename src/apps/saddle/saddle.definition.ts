import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SADDLE_DEFINITION = appDefinition({
  id: 'saddle',
  name: 'Saddle',
  description:
    'Saddle is a decentralized automated market maker on the Ethereum blockchain, optimized for pegged value crypto assets such as stablecoins and wrapped BTC.',
  url: 'https://saddle.exchange/',

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
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(SADDLE_DEFINITION.id)
export class SaddleAppDefinition extends AppDefinition {
  constructor() {
    super(SADDLE_DEFINITION);
  }
}

export default SADDLE_DEFINITION;
