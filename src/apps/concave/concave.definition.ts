import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CONCAVE_DEFINITION = appDefinition({
  id: 'concave',
  name: 'Concave',
  description:
    'A capital efficient, low slippage and high liquidity AMM, Concave Exchange offers traders deeper liquidity and allows LPs to earn more with less capital.',
  url: 'https://concave.lol',

  groups: {
    liquidStaking: {
      id: 'liquid-staking',
      type: GroupType.TOKEN,
      label: 'Liquid Staking',
    },
  },

  tags: [AppTag.LIQUID_STAKING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(CONCAVE_DEFINITION.id)
export class ConcaveAppDefinition extends AppDefinition {
  constructor() {
    super(CONCAVE_DEFINITION);
  }
}

export default CONCAVE_DEFINITION;
