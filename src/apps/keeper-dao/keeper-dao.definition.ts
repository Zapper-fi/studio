import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KEEPER_DAO_DEFINITION = appDefinition({
  id: 'keeper-dao',
  name: 'KeeperDAO',
  description: `KeeperDAO is building a decentralized protocol for Keepers that will help make Ethereum a more secure, egalitarian, and profitable network for all.`,
  url: 'https://www.keeperdao.com/',
  links: {
    github: 'https://github.com/keeperdao',
    twitter: 'https://twitter.com/Keeper_DAO',
    telegram: 'https://t.me/keeperdao',
    discord: 'https://discord.gg/3JUgvyyNhA',
    medium: 'https://medium.com/keeperdao',
  },
  groups: {
    v2Pool: { id: 'v2-pool', type: GroupType.TOKEN },
    v3Pool: { id: 'v3-pool', type: GroupType.TOKEN },
    farm: { id: 'farm', type: GroupType.POSITION },
  },
  tags: [ProtocolTag.YIELD_AGGREGATOR],
  supportedNetworks: { [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW] },
});

@Register.AppDefinition(KEEPER_DAO_DEFINITION.id)
export class KeeperDaoAppDefinition extends AppDefinition {
  constructor() {
    super(KEEPER_DAO_DEFINITION);
  }
}
