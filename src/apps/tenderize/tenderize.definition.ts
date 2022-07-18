import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const TENDERIZE_DEFINITION = appDefinition({
  id: 'tenderize',
  name: 'Tenderize',
  description: 'Connecting Web3 with DeFi through Liquid Staking.',
  url: 'https://app.tenderize.me',

  groups: {
    tender: {
      id: 'tender',
      type: GroupType.TOKEN,
      label: 'Tender Tokens',
    },

    swap: {
      id: 'swap',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
  },

  tags: [AppTag.LIQUID_STAKING, AppTag.LIQUIDITY_POOL],
  keywords: [],

  links: {
    learn: 'https://blog.tenderize.me/',
    github: 'https://github.com/tenderize',
    twitter: 'https://twitter.com/tenderize_me',
    discord: 'https://discord.gg/WXR5VBttP5',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(TENDERIZE_DEFINITION.id)
export class TenderizeAppDefinition extends AppDefinition {
  constructor() {
    super(TENDERIZE_DEFINITION);
  }
}

export default TENDERIZE_DEFINITION;
