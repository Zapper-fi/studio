import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BLIZZ_DEFINITION = appDefinition({
  id: 'blizz',
  name: 'Blizz',
  description: `Blizz is a decentralised non-custodial liquidity market protocol where users can participate as depositors or borrowers.`,
  url: 'https://blizz.finance/',
  tags: [AppTag.LENDING],
  links: {},

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
      groupLabel: 'Supply',
    },

    stableDebt: {
      id: 'stable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
      groupLabel: 'Borrow',
    },

    variableDebt: {
      id: 'variable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
      groupLabel: 'Borrow',
    },

    claimable: {
      id: 'claimable',
      type: GroupType.TOKEN,
      label: 'Reward',
    },
  },

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0xb147656604217a03fe2c73c4838770df8d9d21b8',
    network: Network.AVALANCHE_MAINNET,
  },
});

@Register.AppDefinition(BLIZZ_DEFINITION.id)
export class BlizzAppDefinition extends AppDefinition {
  constructor() {
    super(BLIZZ_DEFINITION);
  }
}
