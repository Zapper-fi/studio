import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HEX_DEFINITION = appDefinition({
  id: 'hex',
  name: 'HEX',
  description: 'HEX is the first high-yield Blockchain Certificate of Deposit.',
  url: 'https://hex.com',
  tags: [AppTag.STAKING],
  primaryColor: '#fff',
  keywords: [],

  links: {
    discord: 'https://discord.com/invite/JmKBUCZKB3',
    telegram: 'https://t.me/HEXcrypto',
    twitter: 'https://twitter.com/HEXcrypto',
  },

  groups: {
    stake: {
      id: 'stake',
      type: GroupType.POSITION,
      label: 'Staked HEX',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(HEX_DEFINITION.id)
export class HexAppDefinition extends AppDefinition {
  constructor() {
    super(HEX_DEFINITION);
  }
}
