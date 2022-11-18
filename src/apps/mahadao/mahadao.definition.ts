import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MAHADAO_DEFINITION = appDefinition({
  id: 'mahadao',
  name: 'mahadao',
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
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
  // token: {
  //   address: '0xbdD8F4dAF71C2cB16ccE7e54BB81ef3cfcF5AAcb',
  //   network: Network.ETHEREUM_MAINNET,
  // },

  primaryColor: '#fff',
});

@Register.AppDefinition(MAHADAO_DEFINITION.id)
export class MahadaoAppDefinition extends AppDefinition {
  constructor() {
    super(MAHADAO_DEFINITION);
  }
}

export default MAHADAO_DEFINITION;
