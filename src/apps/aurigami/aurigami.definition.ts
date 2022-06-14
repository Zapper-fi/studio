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
      label: 'Supply',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Borrow',
    },

    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Claimable',
    },
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
    fairLaunch: '0xC9A848AC73e378516B16E4EeBBa5ef6aFbC0BBc2',
    lens: '0xFfdFfBDB966Cb84B50e62d70105f2Dbf2e0A1e70',
    ply: '0x09c9d464b58d96837f8d8b6f4d9fe4ad408d3a4f',
    comptroller: '0x817af6cfAF35BdC1A634d6cC94eE9e4c68369Aeb',
  },
};

export default AURIGAMI_DEFINITION;
