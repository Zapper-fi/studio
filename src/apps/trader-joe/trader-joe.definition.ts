import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType } from '~app/app.interface';
import { ProtocolTag, ProtocolAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const TRADER_JOE_DEFINITION: AppDefinitionObject = {
  id: 'trader-joe',
  name: 'Trader Joe',
  description: `Trader Joe is your one-stop decentralized trading platform on the Avalanche network.`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN },
    xJoe: { id: 'x-joe', type: GroupType.TOKEN },
    sJoe: { id: 's-joe', type: GroupType.POSITION },
    veJoeFarm: { id: 've-joe-farm', type: GroupType.POSITION },
    chefV2Farm: { id: 'chef-v2-farm', type: GroupType.POSITION },
    chefV3Farm: { id: 'chef-v3-farm', type: GroupType.POSITION },
    chefBoostedFarm: { id: 'chef-boosted-farm', type: GroupType.POSITION },
  },
  url: 'https://traderjoexyz.com/',
  links: {
    github: 'https://github.com/traderjoe-xyz/',
    twitter: 'https://twitter.com/traderjoe_xyz',
    telegram: 'https://t.me/traderjoe_xyz',
    discord: 'https://discord.gg/GHZceZhbZU',
    medium: 'https://traderjoe-xyz.medium.com/',
  },
  tags: [ProtocolTag.LIQUIDITY_POOL],
  supportedNetworks: { [Network.AVALANCHE_MAINNET]: [ProtocolAction.VIEW] },
  primaryColor: '#ee6662',
  token: {
    address: '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd',
    network: Network.AVALANCHE_MAINNET,
  },
};

@Register.AppDefinition(TRADER_JOE_DEFINITION.id)
export class TraderJoeAppDefinition extends AppDefinition {
  constructor() {
    super(TRADER_JOE_DEFINITION);
  }
}
