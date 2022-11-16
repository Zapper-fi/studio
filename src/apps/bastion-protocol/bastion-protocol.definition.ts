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
    supplyMainHub: {
      id: 'supply-main-hub',
      type: GroupType.TOKEN,
      label: 'Main Hub',
    },

    borrowMainHub: {
      id: 'borrow-main-hub',
      type: GroupType.TOKEN,
      label: 'Main Hub',
    },

    supplyStakedNear: {
      id: 'supply-staked-near',
      type: GroupType.TOKEN,
      label: 'Staked NEAR',
    },

    borrowStakedNear: {
      id: 'borrow-staked-near',
      type: GroupType.TOKEN,
      label: 'Staked NEAR',
    },

    supplyAuroraEcosystem: {
      id: 'supply-aurora-ecosystem',
      type: GroupType.TOKEN,
      label: 'Aurora Ecosystem',
    },

    borrowAuroraEcosystem: {
      id: 'borrow-aurora-ecosystem',
      type: GroupType.TOKEN,
      label: 'Aurora Ecosystem',
    },

    supplyMultichain: {
      id: 'supply-multichain',
      type: GroupType.TOKEN,
      label: 'Multichain Realm',
    },

    borrowMultichain: {
      id: 'borrow-multichain',
      type: GroupType.TOKEN,
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
