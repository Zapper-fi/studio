import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MYCELIUM_DEFINITION = appDefinition({
  id: 'mycelium',
  name: 'Mycelium',
  description: 'Mycelium Perpetual Swaps is a decentralised derivative exchange.',
  url: 'https://swaps.mycelium.xyz/',

  groups: {
    mlp: {
      id: 'mlp',
      type: GroupType.TOKEN,
      label: 'MLP',
    },

    esMyc: {
      id: 'es-myc',
      type: GroupType.TOKEN,
      label: 'esMYC',
      isHiddenFromExplore: true,
    },

    levTrades: {
      id: 'lev-trades',
      type: GroupType.POSITION,
      label: 'Leveraged trades',
    },

    perpTokens: {
      id: 'perp-tokens',
      type: GroupType.TOKEN,
      label: 'Perpetual pools tokens',
    },

    perpFarms: {
      id: 'perp-farms',
      type: GroupType.POSITION,
      label: 'Perpetual pools farms',
    },

    staking: {
      id: 'staking',
      type: GroupType.POSITION,
      label: 'Staking',
    },
  },

  token: {
    address: '0xc74fe4c715510ec2f8c61d70d397b32043f55abe',
    network: Network.ARBITRUM_MAINNET,
  },

  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.DERIVATIVES, AppTag.MARGIN_TRADING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(MYCELIUM_DEFINITION.id)
export class MyceliumAppDefinition extends AppDefinition {
  constructor() {
    super(MYCELIUM_DEFINITION);
  }
}

export default MYCELIUM_DEFINITION;
