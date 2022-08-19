import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const STAKE_DAO_DEFINITION = appDefinition({
  id: 'stake-dao',
  name: 'StakeDAO',
  description: `Stake DAO is a non-custodial platform where you can do more with your money. Easily grow, track, and control your assets right from your wallet.`,
  url: 'https://stakedao.org/',
  tags: [AppTag.YIELD_AGGREGATOR],

  links: {
    github: 'https://github.com/StakeDAO',
    twitter: 'https://twitter.com/StakeDAOHQ',
    medium: 'https://stakedaohq.medium.com/',
    discord: 'https://discord.com/invite/stakedaohq',
  },

  groups: {
    locker: {
      id: 'locker',
      type: GroupType.TOKEN,
      label: 'Lockers',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(STAKE_DAO_DEFINITION.id)
export class StakeDaoAppDefinition extends AppDefinition {
  constructor() {
    super(STAKE_DAO_DEFINITION);
  }
}
