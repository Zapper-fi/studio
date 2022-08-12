import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const OPENLEVERAGE_DEFINITION = appDefinition({
  id: 'openleverage',
  name: 'Openleverage',
  description:
    'A permissionless lending and margin trading protocol with aggregated DEX liquidity, enabling traders to go long or short with any pairs on DEXs efficiently and securely.',
  url: 'https://openleverage.finance/',
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    trade: { id: 'trade', type: GroupType.POSITION, label: 'Trade' },
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/OpenLeverage',
    discord: 'https://discord.gg/openLeverage',
    telegram: 'https://t.me/openLeverage',
    medium: 'https://openLeverage.medium.com/',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(OPENLEVERAGE_DEFINITION.id)
export class OpenleverageAppDefinition extends AppDefinition {
  constructor() {
    super(OPENLEVERAGE_DEFINITION);
  }
}

export default OPENLEVERAGE_DEFINITION;
