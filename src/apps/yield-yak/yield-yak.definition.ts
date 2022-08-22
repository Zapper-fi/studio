import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const YIELD_YAK_DEFINITION = appDefinition({
  id: 'yield-yak',
  name: 'Yield Yak',
  description: `Earn more yield. Tools for defi users on $AVAX. Use at your own risk.`,
  url: 'https://yieldyak.com/',
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Farms' },
    vault: { id: 'vault', type: GroupType.TOKEN, label: 'Vaults' },
  },
  links: {
    github: 'https://github.com/yieldyak',
    twitter: 'https://twitter.com/yieldyak_',
    discord: 'https://discord.com/invite/JBbPKzX4rg',
    medium: 'https://yieldyak.medium.com/',
    telegram: 'https://t.me/yieldyak',
  },
  tags: [AppTag.YIELD_AGGREGATOR],
  supportedNetworks: { [Network.AVALANCHE_MAINNET]: [AppAction.VIEW] },
});

@Register.AppDefinition(YIELD_YAK_DEFINITION.id)
export class YieldYakAppDefinition extends AppDefinition {
  constructor() {
    super(YIELD_YAK_DEFINITION);
  }
}
