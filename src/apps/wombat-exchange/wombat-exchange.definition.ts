import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const WOMBAT_EXCHANGE_DEFINITION = appDefinition({
  id: 'wombat-exchange',
  name: 'Wombat Exchange',
  description: 'The hyper-efficient multichain #stableswapV2. #BNB and beyond.',
  url: 'https://wombat.exchange/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Staked',
    },

    chef: {
      id: 'chef',
      type: GroupType.POSITION,
      label: 'Staked',
    },

    votingEscrow: {
      id: 'voting-escrow',
      type: GroupType.POSITION,
      label: 'Voting Escrow',
    },
  },

  token: {
    address: '0xad6742a35fb341a9cc6ad674738dd8da98b94fb1',
    network: Network.BINANCE_SMART_CHAIN_MAINNET,
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  links: {
    learn: 'https://docs.wombat.exchange/docs/',
    github: 'https://github.com/wombat-exchange',
    medium: 'https://medium.com/wombat-exchange',
    discord: 'https://discord.com/invite/DjQKaRwmVb',
    telegram: 'https://t.me/WombatExchange',
    twitter: 'https://twitter.com/WombatExchange',
  },

  supportedNetworks: {
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(WOMBAT_EXCHANGE_DEFINITION.id)
export class WombatExchangeAppDefinition extends AppDefinition {
  constructor() {
    super(WOMBAT_EXCHANGE_DEFINITION);
  }
}

export default WOMBAT_EXCHANGE_DEFINITION;
