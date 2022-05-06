import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { ProtocolAction, ProtocolTag } from '~app/app.interface';
import { GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GRO_DEFINITION = {
  id: 'gro',
  name: 'gro',
  description: 'DeFi yield aggregator that makes it easy to earn stablecoin yields with tranching & automation',
  url: 'https://app.gro.xyz/',
  groups: {
    pools: { id: 'pools', type: GroupType.POSITION },
    vesting: { id: 'vesting', type: GroupType.POSITION },
    labs: { id: 'labs', type: GroupType.TOKEN },
  },
  tags: [ProtocolTag.YIELD_AGGREGATOR],
  links: {
    learn: '',
    github: 'https://github.com/groLabs',
    twitter: 'https://twitter.com/groprotocol',
    telegram: 'https://t.me/gro_discussion',
    discord: 'https://discord.gg/QfYWtWdqPS',
    medium: 'https://medium.com/gro-protocol',
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(GRO_DEFINITION.id)
export class GroAppDefinition extends AppDefinition {
  constructor() {
    super(GRO_DEFINITION);
  }
}

export default GRO_DEFINITION;
