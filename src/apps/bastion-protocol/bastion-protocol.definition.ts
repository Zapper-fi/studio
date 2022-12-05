import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BASTION_PROTOCOL_DEFINITION = appDefinition({
  id: 'bastion-protocol',
  name: 'Bastion',
  description: 'Liquidity Foundation of Aurora',
  url: 'https://bastionprotocol.com/',
  primaryColor: '#fff',
  tags: [AppTag.LENDING, AppTag.LIQUIDITY_POOL],
  keywords: [],

  links: {
    discord: 'https://discord.com/invite/bastionprotocol',
    medium: 'https://bastionprotocol.medium.com/',
    twitter: 'https://twitter.com/BastionProtocol',
  },

  groups: {
    mainHubSupply: {
      id: 'main-hub-supply',
      type: GroupType.TOKEN,
      label: 'Main Hub',
    },

    mainHubBorrow: {
      id: 'main-hub-borrow',
      type: GroupType.POSITION,
      label: 'Main Hub',
    },

    stakedNearSupply: {
      id: 'staked-near-supply',
      type: GroupType.TOKEN,
      label: 'Staked NEAR',
    },

    stakedNearBorrow: {
      id: 'staked-near-borrow',
      type: GroupType.POSITION,
      label: 'Staked NEAR',
    },

    auroraEcosystemSupply: {
      id: 'aurora-ecosystem-supply',
      type: GroupType.TOKEN,
      label: 'Aurora Ecosystem',
    },

    auroraEcosystemBorrow: {
      id: 'aurora-ecosystem-borrow',
      type: GroupType.POSITION,
      label: 'Aurora Ecosystem',
    },

    multichainSupply: {
      id: 'multichain-supply',
      type: GroupType.TOKEN,
      label: 'Multichain Realm',
    },

    multichainBorrow: {
      id: 'multichain-borrow',
      type: GroupType.POSITION,
      label: 'Multichain Realm',
    },

    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Stableswap Pools',
    },
  },

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(BASTION_PROTOCOL_DEFINITION.id)
export class BastionProtocolAppDefinition extends AppDefinition {
  constructor() {
    super(BASTION_PROTOCOL_DEFINITION);
  }
}

export default BASTION_PROTOCOL_DEFINITION;
