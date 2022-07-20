import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BASTION_PROTOCOL_DEFINITION = appDefinition({
  id: 'bastion-protocol',
  name: 'Bastion',
  description: 'Liquidity Foundation of Aurora',
  url: 'https://bastionprotocol.com/',

  groups: {
    supplyMainHub: {
      id: 'supply-main-hub',
      type: GroupType.TOKEN,
      label: 'Main Hub',
      groupLabel: 'Supply',
    },

    borrowMainHub: {
      id: 'borrow-main-hub',
      type: GroupType.TOKEN,
      label: 'Main Hub',
      groupLabel: 'Borrow',
    },

    supplyStakedNear: {
      id: 'supply-staked-near',
      type: GroupType.TOKEN,
      label: 'Staked NEAR',
      groupLabel: 'Supply',
    },

    borrowStakedNear: {
      id: 'borrow-staked-near',
      type: GroupType.TOKEN,
      label: 'Staked NEAR',
      groupLabel: 'Borrow',
    },

    supplyAuroraEcosystem: {
      id: 'supply-aurora-ecosystem',
      type: GroupType.TOKEN,
      label: 'Aurora Ecosystem',
      groupLabel: 'Supply',
    },

    borrowAuroraEcosystem: {
      id: 'borrow-aurora-ecosystem',
      type: GroupType.TOKEN,
      label: 'Aurora Ecosystem',
      groupLabel: 'Borrow',
    },

    supplyMultichain: {
      id: 'supply-multichain',
      type: GroupType.TOKEN,
      label: 'Multichain Realm',
      groupLabel: 'Supply',
    },

    borrowMultichain: {
      id: 'borrow-multichain',
      type: GroupType.TOKEN,
      label: 'Multichain Realm',
      groupLabel: 'Borrow',
    },

    swap: {
      id: 'swap',
      type: GroupType.TOKEN,
      label: 'Stableswap Pools',
    },
  },
  presentationConfig: {
    tabs: [
      {
        label: 'Main Hub',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-main-hub'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-main-hub'],
          },
        ],
      },
      {
        label: 'Staked Near',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-staked-near'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-staked-near'],
          },
        ],
      },
      {
        label: 'Aurora Ecosystem',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-aurora-ecosystem'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-aurora-ecosystem'],
          },
        ],
      },
      {
        label: 'Multichain Realm',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-multichain'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-multichain'],
          },
        ],
      },
      { label: 'Stableswap Pools', viewType: 'list', groupIds: ['swap'] },
    ],
  },
  tags: [AppTag.LENDING, AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(BASTION_PROTOCOL_DEFINITION.id)
export class BastionProtocolAppDefinition extends AppDefinition {
  constructor() {
    super(BASTION_PROTOCOL_DEFINITION);
  }
}

export default BASTION_PROTOCOL_DEFINITION;
