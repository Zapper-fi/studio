import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GAMMA_STRATEGIES_DEFINITION = appDefinition({
  id: 'gamma-strategies',
  name: 'Gamma Strategies',
  description: `Access active liquidity management on Uniswap v3. Gamma has developed a protocol, a management infrastructure, and a variety of strategies used by managers and market makers.`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    xGamma: { id: 'x-gamma', type: GroupType.TOKEN, label: 'xGAMMA' },
    tGamma: { id: 't-gamma', type: GroupType.TOKEN, label: 'tGAMMA' },
  },
  tags: [AppTag.FUND_MANAGER],
  links: {
    twitter: 'https://twitter.com/gammastrategies',
    discord: 'https://discord.com/invite/gWA7NGsV6E',
    telegram: 'https://t.me/gammastrategies',
  },
  supportedNetworks: { [Network.ETHEREUM_MAINNET]: [AppAction.VIEW] },
  primaryColor: '#FF0025',
  url: 'https://www.gammastrategies.org/',
  token: {
    address: '0x6bea7cfef803d1e3d5f7c0103f7ded065644e197',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(GAMMA_STRATEGIES_DEFINITION.id)
export class GammaStrategiesAppDefinition extends AppDefinition {
  constructor() {
    super(GAMMA_STRATEGIES_DEFINITION);
  }
}
