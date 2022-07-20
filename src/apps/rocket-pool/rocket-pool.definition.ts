import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ROCKET_POOL_DEFINITION = appDefinition({
  id: 'rocket-pool',
  name: 'Rocket Pool',
  description: 'Decentralised Ethereum staking protocol',
  url: 'https://rocketpool.net',
  links: {
    github: 'https://github.com/rocket-pool',
    twitter: 'https://twitter.com/Rocket_Pool',
    discord: 'https://discord.com/invite/rocketpool',
    medium: 'https://medium.com/rocket-pool',
  },
  tags: [AppTag.LIQUID_STAKING],

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  groups: {
    staking: {
      id: 'staking',
      type: GroupType.POSITION,
      label: 'Staking',
    },

    oracleDaoBond: {
      id: 'oracle-dao-bond',
      type: GroupType.POSITION,
      label: 'Oracle DAO Bond',
    },
  },

  primaryColor: '#f97516',
});

@Register.AppDefinition(ROCKET_POOL_DEFINITION.id)
export class RocketPoolAppDefinition extends AppDefinition {
  constructor() {
    super(ROCKET_POOL_DEFINITION);
  }
}

export default ROCKET_POOL_DEFINITION;
