import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const COMETHSWAP_DEFINITION = appDefinition({
  id: 'comethswap',
  name: 'Comethswap',
  description:
    'ComethSwap, is layer2 decentralized exchange that lets you swap any ERC20 tokens at low cost, in no time.',
  url: 'https://swap.cometh.io/#/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
  },

  tags: [AppTag.FARMING],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/cometh',
    medium: 'https://medium.com/cometh',
    telegram: 'https://t.me/cometh_io',
    twitter: 'https://twitter.com/MUSTCometh',
  },

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(COMETHSWAP_DEFINITION.id)
export class ComethswapAppDefinition extends AppDefinition {
  constructor() {
    super(COMETHSWAP_DEFINITION);
  }
}

export default COMETHSWAP_DEFINITION;
