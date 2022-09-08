import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AIRSWAP_DEFINITION = appDefinition({
  id: 'airswap',
  name: 'AirSwap',
  description:
    'AirSwap is an open community of developers, designers, writers, and tinkerers building decentralized trading systems. Protocol fees are automatically distributed to contributors.',
  url: 'https://airswap.io',
  links: {
    github: 'https://github.com/airswap',
    twitter: 'https://twitter.com/airswap',
    discord: 'https://chat.airswap.io/',
    medium: 'https://airswap.medium.com/',
  },
  groups: {
    sASTv2: { id: 's-ast-v2', type: GroupType.TOKEN, label: 'Staking' },
    sASTv3: { id: 's-ast-v3', type: GroupType.TOKEN, label: 'Staking' },
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#2B71FF',
});

@Register.AppDefinition(AIRSWAP_DEFINITION.id)
export class AirswapAppDefinition extends AppDefinition {
  constructor() {
    super(AIRSWAP_DEFINITION);
  }
}

export default AIRSWAP_DEFINITION;
