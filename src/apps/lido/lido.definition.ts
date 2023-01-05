import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LIDO_DEFINITION = appDefinition({
  id: 'lido',
  name: 'Lido',
  description: 'Liquidity for staked assets',
  url: 'https://lido.fi/',
  tags: [AppTag.LIQUID_STAKING],

  links: {
    github: 'https://github.com/lidofinance',
    twitter: 'https://twitter.com/lidofinance',
    discord: 'https://discord.com/invite/lido',
    telegram: 'https://t.me/lidofinance',
    medium: 'https://lidofinance.medium.com/',
  },

  groups: {
    steth: {
      id: 'steth',
      type: GroupType.TOKEN,
      label: 'Stake',
    },

    wsteth: {
      id: 'wsteth',
      type: GroupType.TOKEN,
      label: 'Wrap',
    },

    stksm: {
      id: 'stksm',
      type: GroupType.TOKEN,
      label: 'Stake',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(LIDO_DEFINITION.id)
export class LidoAppDefinition extends AppDefinition {
  constructor() {
    super(LIDO_DEFINITION);
  }
}
