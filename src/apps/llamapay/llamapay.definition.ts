import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LLAMAPAY_DEFINITION = appDefinition({
  id: 'llamapay',
  name: 'Llamapay',
  description:
    'LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second.',
  url: 'https://llamapay.io/',

  groups: {
    stream: {
      id: 'stream',
      type: GroupType.POSITION,
      label: 'Stream',
    },
  },

  tags: [AppTag.PAYMENTS],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/buPFYXzDDd',
    github: 'https://github.com/LlamaPay',
    twitter: 'https://twitter.com/llamapay_io/',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#23BD8F',
});

@Register.AppDefinition(LLAMAPAY_DEFINITION.id)
export class LlamapayAppDefinition extends AppDefinition {
  constructor() {
    super(LLAMAPAY_DEFINITION);
  }
}

export default LLAMAPAY_DEFINITION;
