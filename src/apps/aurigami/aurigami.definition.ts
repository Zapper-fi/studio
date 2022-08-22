import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AURIGAMI_DEFINITION = appDefinition({
  id: 'aurigami',
  name: 'Aurigami',
  description: 'The native money market on Aurora.',
  url: 'https://www.aurigami.finance/',
  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Lending',
    },

    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Claimable',
      isHiddenFromExplore: true,
    },
  },
  presentationConfig: {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow'],
          },
        ],
      },
    ],
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(AURIGAMI_DEFINITION.id)
export class AurigamiAppDefinition extends AppDefinition {
  constructor() {
    super(AURIGAMI_DEFINITION);
  }
}

export const AURIGAMI_CONTRACT_ADDRESSES = {
  [Network.AURORA_MAINNET]: {
    fairLaunch: '0xc9a848ac73e378516b16e4eebba5ef6afbc0bbc2',
    lens: '0xffdffbdb966cb84b50e62d70105f2dbf2e0a1e70',
    ply: '0x09c9d464b58d96837f8d8b6f4d9fe4ad408d3a4f',
    comptroller: '0x817af6cfaf35bdc1a634d6cc94ee9e4c68369aeb',
  },
};

export default AURIGAMI_DEFINITION;
