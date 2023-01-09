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
    esMyc: {
      id: 'es-myc',
      type: GroupType.TOKEN,
      label: 'esMYC',
      isHiddenFromExplore: true,
    },
    mpl: {
      id: 'mlp',
      type: GroupType.TOKEN,
      label: 'MLP',
    },
    perp: {
      id: 'perp',
      type: GroupType.POSITION,
      label: 'Perpetuals',
    },
  },

  tags: [AppTag.MARGIN_TRADING],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/mycelium-xyz',
    github: 'https://github.com/mycelium-ethereum',
    twitter: 'https://twitter.com/mycelium_xyz',
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0xc74fe4c715510ec2f8c61d70d397b32043f55abe',
    network: Network.ARBITRUM_MAINNET,
  },
});

@Register.AppDefinition(MYCELIUM_DEFINITION.id)
export class MyceliumAppDefinition extends AppDefinition {
  constructor() {
    super(MYCELIUM_DEFINITION);
  }
}

export default MYCELIUM_DEFINITION;
