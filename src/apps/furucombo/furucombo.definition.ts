import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const furucomboToken = {
  address: '0xffffffff2ba8f66d4e51811c5190992176930278',
  network: Network.ETHEREUM_MAINNET,
};

export const FURUCOMBO_DEFINITION = appDefinition({
  id: 'furucombo',
  name: 'Furucombo',
  description: 'Master DeFi like a Pro. The simplest way to optimize and manage your crypto.',
  url: 'https://furucombo.app/',

  groups: {
    fund: { id: 'fund', type: GroupType.TOKEN, label: 'Furucombo Funds' },
  },

  tags: [AppTag.ASSET_MANAGEMENT, AppTag.FUND_MANAGER],
  keywords: [],
  links: {
    github: 'https://github.com/dinngodev',
    twitter: 'https://twitter.com/furucombo',
    discord: 'https://discord.furucombo.app/',
    telegram: 'https://t.me/furucombo',
    medium: 'https://medium.com/furucombo',
  },

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#1b1b21',

  token: furucomboToken,
});

@Register.AppDefinition(FURUCOMBO_DEFINITION.id)
export class FurucomboAppDefinition extends AppDefinition {
  constructor() {
    super(FURUCOMBO_DEFINITION);
  }
}

export default FURUCOMBO_DEFINITION;
