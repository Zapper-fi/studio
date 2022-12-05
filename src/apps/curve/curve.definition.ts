import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CURVE_DEFINITION = appDefinition({
  id: 'curve',
  name: 'Curve',
  description: `An exchange liquidity pool on Ethereum designed for: extremely efficient stablecoin trading, low risk, supplemental fee income for liquidity providers`,
  url: 'https://curve.fi',
  tags: [AppTag.LIQUIDITY_POOL],
  primaryColor: '#34649c',

  token: {
    address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    network: Network.ETHEREUM_MAINNET,
  },

  links: {
    github: 'https://github.com/curvefi/',
    twitter: 'https://twitter.com/curvefinance',
    discord: 'https://discord.com/invite/rgrfS7W',
    telegram: 'https://t.me/curvefi',
  },

  groups: {
    cryptoPoolGauge: {
      id: 'crypto-pool-gauge',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    cryptoPool: {
      id: 'crypto-pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    factoryCryptoPoolGauge: {
      id: 'factory-crypto-pool-gauge',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    factoryCryptoPool: {
      id: 'factory-crypto-pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    factoryStablePoolGauge: {
      id: 'factory-stable-pool-gauge',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    factoryStablePool: {
      id: 'factory-stable-pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    stablePoolGauge: {
      id: 'stable-pool-gauge',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    stablePool: {
      id: 'stable-pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    childLiquidityGauge: {
      id: 'child-liquidity-gauge',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    rewardsOnlyGauge: {
      id: 'rewards-only-gauge',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    votingEscrow: {
      id: 'voting-escrow',
      type: GroupType.POSITION,
      label: 'Voting Escrow',
    },

    vestingEscrow: {
      id: 'vesting-escrow',
      type: GroupType.POSITION,
      label: 'Vesting',
    },
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(CURVE_DEFINITION.id)
export class CurveAppDefinition extends AppDefinition {
  constructor() {
    super(CURVE_DEFINITION);
  }
}
