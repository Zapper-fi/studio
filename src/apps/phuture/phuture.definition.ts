import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PHUTURE_DEFINITION = appDefinition({
  id: 'phuture',
  name: 'Phuture',
  description:
    'Phuture is a decentralised crypto index platform that simplifies investments through automated, themed index funds.',
  url: 'https://phuture.finance',
  tags: [AppTag.ASSET_MANAGEMENT],
  keywords: ['index funds', 'asset management'],

  links: {
    learn: 'https://docs.phuture.finance',
    github: 'https://github.com/Phuture-Finance',
    twitter: 'https://twitter.com/phuture_finance',
    telegram: 'https://t.me/phutureofficialann',
    discord: 'https://discord.gg/xQzTbdrj',
    medium: 'https://blog.phuture.finance',
  },

  groups: {
    index: {
      id: 'index',
      type: GroupType.TOKEN,
      label: 'Index',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW], // AppAction.TRANSACT
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW], // AppAction.TRANSACT
  },

  primaryColor: '#3e1fff',

  token: {
    address: '0xe1fc4455f62a6e89476f1072530c20cf1a0622da',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(PHUTURE_DEFINITION.id)
export class PhutureAppDefinition extends AppDefinition {
  constructor() {
    super(PHUTURE_DEFINITION);
  }
}

export default PHUTURE_DEFINITION;
