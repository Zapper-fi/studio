import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppTag, AppAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BISWAP_DEFINITION = appDefinition({
  id: 'biswap',
  name: 'Biswap',
  description: `Enjoy the lowest exchange fee, profitable features & Multi-type Referral program`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
  },
  url: 'https://app.beets.fi/',
  links: {
    github: 'https://github.com/biswap-org',
    twitter: 'https://twitter.com/Biswap_DEX',
    medium: 'https://biswap-dex.medium.com/',
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  supportedNetworks: { [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW] },
});

@Register.AppDefinition(BISWAP_DEFINITION.id)
export class BiswapAppDefinition extends AppDefinition {
  constructor() {
    super(BISWAP_DEFINITION);
  }
}
