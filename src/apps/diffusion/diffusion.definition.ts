import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const DIFFUSION_DEFINITION = appDefinition({
  id: 'diffusion',
  name: 'Diffusion Finance',
  description: 'The Evmos AMM ⚛️💙🐧',
  url: 'https://app.diffusion.fi/',

  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    farm: { id: 'farm', type: GroupType.TOKEN, label: 'Staked' },
    diffStaking: { id: 'diff-staking', type: GroupType.TOKEN, label: 'xDiff Pools' },
  },

  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.FARMING, AppTag.LIQUIDITY_POOL, AppTag.STAKING],

  keywords: ['dex', 'defi', 'evmos', 'cosmos', 'decentralized finance', 'diffusion', 'pools', 'liquidity', 'staking'],
  links: {
    github: 'https://github.com/diffusion-fi',
    twitter: 'https://twitter.com/diffusion_fi',
    discord: 'http://discord.gg/diffusion-fi',
  },

  supportedNetworks: {
    [Network.EVMOS_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0x3f75ceabcdfed1aca03257dc6bdc0408e2b4b026',
    network: Network.EVMOS_MAINNET,
  },

  primaryColor: '#27D2EA',
});

@Register.AppDefinition(DIFFUSION_DEFINITION.id)
export class DiffusionAppDefinition extends AppDefinition {
  constructor() {
    super(DIFFUSION_DEFINITION);
  }
}

export default DIFFUSION_DEFINITION;
