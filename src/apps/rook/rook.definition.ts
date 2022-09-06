import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ROOK_DEFINITION = appDefinition({
  id: 'rook',
  name: 'Rook',
  description: `Rook is a neutral order flow auction that enables users to create revenue from the MEV they generate on Ethereum and beyond.`,
  url: 'https://www.rook.fi/',
  tags: [AppTag.YIELD_AGGREGATOR, AppTag.DECENTRALIZED_EXCHANGE],
  links: {
    github: 'https://github.com/keeperdao',
    twitter: 'https://twitter.com/Rook',
    discord: 'http://discord.gg/rook',
    medium: 'https://www.rookbase.xyz/',
  },

  groups: {
    v2Pool: {
      id: 'v2-pool',
      type: GroupType.TOKEN,
      label: 'V2 Pools',
    },

    v3Pool: {
      id: 'v3-pool',
      type: GroupType.TOKEN,
      label: 'V3 Pools',
    },

    xRook: {
      id: 'x-rook',
      type: GroupType.TOKEN,
      label: 'xROOK',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(ROOK_DEFINITION.id)
export class RookAppDefinition extends AppDefinition {
  constructor() {
    super(ROOK_DEFINITION);
  }
}
