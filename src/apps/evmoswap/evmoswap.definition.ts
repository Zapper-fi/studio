import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const EVMOSWAP_DEFINITION = appDefinition({
  id: 'evmoswap',
  name: 'EvmoSwap',
  description:
    'EvmoSwap is a Decentralized Autonomous Organization (DAO) that offers a full suite of tools to explore and engage with decentralized finance opportunities.',
  url: 'https://app.evmoswap.org',
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    farm: { id: 'farm', type: GroupType.TOKEN, label: 'Staked', groupLabel: 'Farms' },
  },

  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.FARMING, AppTag.LIQUIDITY_POOL, AppTag.STAKING],

  keywords: ['dex', 'defi', 'evmos', 'cosmos', 'decentralized finance', 'evmoswap', 'pools', 'liquidity', 'staking'],
  links: {
    github: 'https://github.com/evmoswap',
    twitter: 'https://twitter.com/evmoswap',
    discord: 'http://discord.gg/cEp53UXPw3',
  },

  supportedNetworks: {
    [Network.EVMOS_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0x181c262b973b22c307c646a67f64b76410d19b6b',
    network: Network.EVMOS_MAINNET,
  },

  primaryColor: '#121212',
});

@Register.AppDefinition(EVMOSWAP_DEFINITION.id)
export class EvmoswapAppDefinition extends AppDefinition {
  constructor() {
    super(EVMOSWAP_DEFINITION);
  }
}

export default EVMOSWAP_DEFINITION;
