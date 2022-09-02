import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PENDLE_DEFINITION = appDefinition({
  id: 'pendle',
  name: 'Pendle',
  description: `Split your yield-bearing assets into separate yield and ownership components to bet on and hedge against future yield.`,
  url: 'https://pendle.finance/',
  tags: [AppTag.LIQUIDITY_POOL, AppTag.LOTTERY],

  links: {
    twitter: 'https://twitter.com/pendle_fi',
    discord: 'discord.gg/uawbcnRMK9',
    telegram: 'http://t.me/pendlefinance',
    medium: 'https://pendle.medium.com/',
  },

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    liquidityMining: {
      id: 'liquidity-mining',
      type: GroupType.POSITION,
      label: 'Liquidity Mining',
    },

    yield: {
      id: 'yield',
      type: GroupType.TOKEN,
      label: 'Future Yield',
    },

    ownership: {
      id: 'ownership',
      type: GroupType.TOKEN,
      label: 'Ownership',
    },
  },

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(PENDLE_DEFINITION.id)
export class PendleAppDefinition extends AppDefinition {
  constructor() {
    super(PENDLE_DEFINITION);
  }
}
