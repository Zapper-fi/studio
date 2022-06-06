import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const YIELD_PROTOCOL_DEFINITION = appDefinition({
  id: 'yield-protocol',
  name: 'Yield Protocol',
  description: 'Yield Protocol brings fixed-rate borrowing and lending for fixed terms to decentralized finance.',
  url: 'https://app.yieldprotocol.com/',
  groups: {
    borrow: { id: 'borrow', type: GroupType.POSITION, label: 'Borrow' },
    lend: { id: 'lend', type: GroupType.TOKEN, label: 'Lend' },
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pool' },
  },

  tags: [AppTag.BONDS, AppTag.COLLATERALIZED_DEBT_POSITION, AppTag.LENDING, AppTag.LIQUIDITY_POOL],

  links: {
    github: 'https://github.com/yieldprotocol',
    twitter: 'https://twitter.com/yield',
    discord: 'https://discord.gg/JAFfDj5',
    learn: 'https://docs.yieldprotocol.com/#/',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(YIELD_PROTOCOL_DEFINITION.id)
export class YieldProtocolAppDefinition extends AppDefinition {
  constructor() {
    super(YIELD_PROTOCOL_DEFINITION);
  }
}

export default YIELD_PROTOCOL_DEFINITION;
