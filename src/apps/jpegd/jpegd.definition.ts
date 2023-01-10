import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const JPEGD_DEFINITION = appDefinition({
  id: 'jpegd',
  name: 'Jpegd',
  description: 'JPEGd is the leading NFT lending platform in the decentralized finance space.',
  url: 'https://jpegd.io/',
  tags: [AppTag.COLLATERALIZED_DEBT_POSITION],
  primaryColor: '#fff',

  links: {
    twitter: 'https://twitter.com/JPEGd_69',
    discord: 'https://discord.com/invite/jpegd',
    telegram: 'https://t.me/jpegd',
    medium: 'https://medium.com/@jpegd',
  },

  groups: {
    chefV1: {
      id: 'chef-v1',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    chefV2: {
      id: 'chef-v2',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    bond: {
      id: 'bond',
      type: GroupType.POSITION,
      label: 'Bonds',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(JPEGD_DEFINITION.id)
export class JpegdAppDefinition extends AppDefinition {
  constructor() {
    super(JPEGD_DEFINITION);
  }
}
