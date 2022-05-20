import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag } from '~app/app.interface';
import { GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SYMPHONY_DEFINITION = appDefinition({
  id: 'symphony',
  name: 'Symphony Finance',
  description:
    'Symphony Finance is an innovation driven DeFi Labs building cutting edge products for individuals, companies, & DAOs. First product is Yield Optimized Limit Order.',
  url: 'https://app.symphony.finance',
  groups: {
    yolo: {
      id: 'yolo',
      type: GroupType.POSITION,
      label: 'Orders',
    },
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.LIMIT_ORDER],
  keywords: ['limit', 'stoploss', 'yield', 'yolo', 'limit-order'],
  links: {
    twitter: 'https://twitter.com/SymphonyFinance',
    discord: 'https://discord.com/invite/HsVP3KP3VD',
    github: 'https://github.com/symphony-finance',
    medium: 'https://symphony-finance.medium.com',
    learn: 'https://symphonyfi.gitbook.io/docs',
  },
  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#1f222c',
});

@Register.AppDefinition(SYMPHONY_DEFINITION.id)
export class SymphonyAppDefinition extends AppDefinition {
  constructor() {
    super(SYMPHONY_DEFINITION);
  }
}

export default SYMPHONY_DEFINITION;
