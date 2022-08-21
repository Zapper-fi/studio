import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CONVEX_DEFINITION = appDefinition({
  id: 'convex',
  name: 'Convex',
  description: `A platform that boosts rewards for CRV stakers and liquidity providers alike`,
  url: 'https://www.convexfinance.com/',
  tags: [AppTag.YIELD_AGGREGATOR],
  primaryColor: '#1682fe',
  links: {},

  groups: {
    deposit: {
      id: 'deposit',
      type: GroupType.TOKEN,
      label: 'Liqudity Pool Staking',
      groupLabel: 'Pools',
      isHiddenFromExplore: true,
    },

    cvxStaking: {
      id: 'cvx-staking',
      type: GroupType.POSITION,
      label: 'CVX Staking',
      groupLabel: 'Farms',
    },

    cvxCrvStaking: {
      id: 'cvx-crv-staking',
      type: GroupType.POSITION,
      label: 'cvxCRV Staking',
      groupLabel: 'Farms',
    },

    lpFarm: {
      id: 'lp-farm',
      type: GroupType.POSITION,
      label: 'Liqudity Pool Staking',
      groupLabel: 'Pools',
    },

    votingEscrow: {
      id: 'voting-escrow',
      type: GroupType.POSITION,
      label: 'Vote Locked CVX',
    },

    depositor: {
      id: 'depositor',
      type: GroupType.POSITION,
      label: 'Depositor',
      isHiddenFromExplore: true,
    },

    abracadabraClaimable: {
      id: 'abracadabra-claimable',
      type: GroupType.POSITION,
      label: 'Abracadabra Rewards',
      isHiddenFromExplore: true,
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(CONVEX_DEFINITION.id)
export class ConvexAppDefinition extends AppDefinition {
  constructor() {
    super(CONVEX_DEFINITION);
  }
}
