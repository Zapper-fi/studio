import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PSTAKE_DEFINITION = appDefinition({
  id: 'pstake',
  name: 'pSTAKE',
  description: 'pSTAKE is a liquid staking protocol unlocking the liquidity of staked assets. ',
  url: 'https://pstake.finance/',

  groups: {
    stake: {
      id: 'Stake',
      type: GroupType.TOKEN,
      label: 'Stake',
    },
  },

  tags: [AppTag.LIQUID_STAKING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(PSTAKE_DEFINITION.id)
export class PstakeAppDefinition extends AppDefinition {
  constructor() {
    super(PSTAKE_DEFINITION);
  }
}

export default PSTAKE_DEFINITION;
