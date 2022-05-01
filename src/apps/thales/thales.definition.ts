import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const THALES_DEFINITION = {
  id: 'thales',
  name: 'thales',
  description: 'Novel on-chain, permissionless, and non-custodial Parimutuel Markets.',
  url: 'https://thalesmarket.io/',
  groups: {
    market: { id: 'market', type: GroupType.TOKEN },
  },
  tags: [ProtocolTag.OPTIONS],
  links: {
    learn: 'https://thalesmarket.io/tale-of-thales',
    github: 'https://github.com/thales-markets',
    twitter: 'https://twitter.com/thalesmarket',
    telegram: 'https://t.me/thalesprotocol',
    discord: 'https://discord.gg/thales',
    medium: 'https://thalesmarket.medium.com/',
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(THALES_DEFINITION.id)
export class ThalesAppDefinition extends AppDefinition {
  constructor() {
    super(THALES_DEFINITION);
  }
}

export default THALES_DEFINITION;
