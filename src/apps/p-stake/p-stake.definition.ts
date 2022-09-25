import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const P_STAKE_DEFINITION = appDefinition({
  id: 'p-stake',
  name: 'pSTAKE',
  description: 'pSTAKE is a liquid staking protocol unlocking the liquidity of staked assets. ',
  url: 'https://pstake.finance/',

  groups: {
    stake: {
      id: 'stake',
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

@Register.AppDefinition(P_STAKE_DEFINITION.id)
export class PStakeAppDefinition extends AppDefinition {
  constructor() {
    super(P_STAKE_DEFINITION);
  }
}

export default P_STAKE_DEFINITION;
