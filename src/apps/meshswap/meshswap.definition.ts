import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MESHSWAP_DEFINITION = appDefinition({
  id: 'meshswap',
  name: 'Meshswap',
  description: `Swap, Lend, Farm & Leverage, Stake
  And maximize your yields on the liquidity mesh.`,
  url: 'https://meshswap.fi/',
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pool' },
    supply: { id: 'supply', type: GroupType.TOKEN, label: 'Supply' },
  },
  tags: [AppTag.LENDING, AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/meshswap',
    medium: 'https://medium.com/@Meshswap',
    twitter: 'https://twitter.com/Meshswap_Fi',
    telegram: 'https://t.me/MeshswapOfficial',
  },
  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(MESHSWAP_DEFINITION.id)
export class MeshswapAppDefinition extends AppDefinition {
  constructor() {
    super(MESHSWAP_DEFINITION);
  }
}
