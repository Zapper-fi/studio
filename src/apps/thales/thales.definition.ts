import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const THALES_DEFINITION = appDefinition({
  id: 'thales',
  name: 'Thales',
  description: 'Novel on-chain, permissionless, and non-custodial Parimutuel Markets.',
  url: 'https://thalesmarket.io/',
  groups: {
    staking: { id: 'staking', type: GroupType.POSITION, label: 'Staking' },
    escrow: { id: 'escrow', type: GroupType.POSITION, label: 'Escrow' },
    pool2: { id: 'pool2', type: GroupType.POSITION, label: 'LP Staking' },
  },
  tags: [AppTag.OPTIONS],
  links: {
    learn: 'https://thalesmarket.io/tale-of-thales',
    github: 'https://github.com/thales-markets',
    twitter: 'https://twitter.com/thalesmarket',
    telegram: 'https://t.me/thalesprotocol',
    discord: 'https://discord.gg/thales',
    medium: 'https://thalesmarket.medium.com/',
  },
  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(THALES_DEFINITION.id)
export class ThalesAppDefinition extends AppDefinition {
  constructor() {
    super(THALES_DEFINITION);
  }
}
