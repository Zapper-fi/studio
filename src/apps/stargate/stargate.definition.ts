import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const STARGATE_DEFINITION = appDefinition({
  id: 'stargate',
  name: 'Stargate',
  description: `A fully composable native asset bridge with unified liquidity. An open source API framework for data.`,
  url: 'https://stargate.finance/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pool',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },

    votingEscrow: {
      id: 'voting-escrow',
      type: GroupType.TOKEN,
      label: 'Voting Escrow',
    },

    eth: {
      id: 'eth',
      type: GroupType.TOKEN,
      label: 'Wrapper',
    },

    auctionLocked: {
      id: 'auction-locked',
      type: GroupType.TOKEN,
      label: 'Auction Locked',
    },
  },

  tags: [AppTag.INFRASTRUCTURE],
  keywords: [],

  links: {
    github: 'https://github.com/solace-fi',
    twitter: 'https://twitter.com/SolaceFi/',
    telegram: 'https://t.me/solacefi',
    discord: 'https://discord.com/invite/7v8qsyepfu/',
    medium: 'https://medium.com/solace-fi/',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(STARGATE_DEFINITION.id)
export class StargateAppDefinition extends AppDefinition {
  constructor() {
    super(STARGATE_DEFINITION);
  }
}
