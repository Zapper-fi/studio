import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SPOOL_DEFINITION = appDefinition({
  id: 'spool',
  name: 'Spool',
  description:
    'Spool is decentralized middleware that allows anyone to create custom, diversified, and automated DeFi meta-strategies called “Smart Vaults”.',
  url: 'https://app.spool.fi',

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.POSITION,
      label: 'Spools',
    },
    staking: {
      id: 'staking',
      type: GroupType.POSITION,
      label: 'Staking',
    },
  },

  tags: [AppTag.INFRASTRUCTURE, AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',

  token: {
    address: '0x40803cea2b2a32bda1be61d3604af6a814e70976',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(SPOOL_DEFINITION.id)
export class SpoolAppDefinition extends AppDefinition {
  constructor() {
    super(SPOOL_DEFINITION);
  }
}

export default SPOOL_DEFINITION;
