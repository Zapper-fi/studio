import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BADGER_DEFINITION = appDefinition({
  id: 'badger',
  name: 'Badger',
  description: `BadgerDAO is a decentralized collective of developers, strategists, and content creators who seek to build and support new Bitcoin-focused products for the DeFi ecosystem.`,
  url: 'https://badger.com/',

  groups: {
    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Rewards',
    },
    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'Vaults',
    },
  },

  tags: [AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/badgerdao',
    discord: 'https://discord.com/invite/xSPFHHS',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(BADGER_DEFINITION.id)
export class BadgerAppDefinition extends AppDefinition {
  constructor() {
    super(BADGER_DEFINITION);
  }
}

export default BADGER_DEFINITION;
