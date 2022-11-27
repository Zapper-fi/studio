import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MAHADAO_DEFINITION = appDefinition({
  id: 'mahadao',
  name: 'MahaDAO',
  description:
    'MahaDAO is on a community-driven mission to promote financial liberty with a decentralized currency ($ARTH) and a governance token ($MAHA)',
  url: 'https://gov.mahadao.com/#/',

  groups: {
    locker: {
      id: 'locker',
      type: GroupType.TOKEN,
      label: 'MAHAX Locker',
    },
  },

  tags: [AppTag.FARMING, AppTag.STAKING],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/mahadao',
    github: 'https://github.com/mahadao',
    telegram: 'https://t.me/MahaDAO',
    twitter: 'https://twitter.com/TheMahaDAO',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(MAHADAO_DEFINITION.id)
export class MahadaoAppDefinition extends AppDefinition {
  constructor() {
    super(MAHADAO_DEFINITION);
  }
}

export default MAHADAO_DEFINITION;
