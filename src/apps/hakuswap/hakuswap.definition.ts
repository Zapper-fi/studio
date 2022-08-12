import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HAKUSWAP_DEFINITION = appDefinition({
  id: 'hakuswap',
  name: 'Hakuswap',
  description:
    'HakuSwap is a crypto world for users to trade, earn, and game. It is the premier choice for projects on Avalanche with features including AMM, NFT, and GameFi.',
  url: 'https://hakuswap.com/',

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

  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.FARMING],
  keywords: [],
  links: {
    github: 'https://github.com/hakuswap',
    twitter: 'https://twitter.com/hakuswap',
    medium: 'https://hakuswap.medium.com',
  },

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#09bcab',
});

@Register.AppDefinition(HAKUSWAP_DEFINITION.id)
export class HakuswapAppDefinition extends AppDefinition {
  constructor() {
    super(HAKUSWAP_DEFINITION);
  }
}

export default HAKUSWAP_DEFINITION;
