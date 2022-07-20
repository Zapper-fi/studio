import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AURA_DEFINITION = appDefinition({
  id: 'aura',
  name: 'Aura Finance',
  description:
    'Aura Finance is a governance and liquidity aggregation protocol built on top of Balancer, with platform-agnostic support for any ve-token system.',
  url: 'https://app.aura.finance',

  groups: {
    chef: {
      id: 'chef',
      type: GroupType.TOKEN,
      label: 'auraBAL Rewards',
    },
    staking: {
      id: 'staking',
      type: GroupType.TOKEN,
      label: 'Staked auraBAL',
    },
    pools: {
      id: 'pools',
      type: GroupType.TOKEN,
      label: 'Balancer Pools',
    },
    locker: {
      id: 'locker',
      type: GroupType.POSITION,
      label: 'Locked AURA',
    },
  },

  tags: [AppTag.LIQUIDITY_POOL],
  keywords: [],

  links: {
    twitter: 'https://twitter.com/AuraFinance',
    discord: 'https://discord.gg/aurafinance',
    medium: 'https://mirror.xyz/0xfEE0Bbe31345a7c27368534fEf45a57133FF3A86',
    github: 'https://github.com/aurafinance',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#7c3aed',

  token: {
    address: '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(AURA_DEFINITION.id)
export class AuraAppDefinition extends AppDefinition {
  constructor() {
    super(AURA_DEFINITION);
  }
}

export default AURA_DEFINITION;
