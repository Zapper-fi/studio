import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag } from '~app/app.interface';
import { GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GRO_DEFINITION = appDefinition({
  id: 'gro',
  name: 'gro',
  description: 'DeFi yield aggregator that makes it easy to earn stablecoin yields with tranching & automation',
  url: 'https://app.gro.xyz/',
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
    vesting: { id: 'vesting', type: GroupType.POSITION },
    labs: { id: 'labs', type: GroupType.TOKEN },
  },
  tags: [AppTag.YIELD_AGGREGATOR],
  links: {
    learn: '',
    github: 'https://github.com/groLabs',
    twitter: 'https://twitter.com/groprotocol',
    telegram: 'https://t.me/gro_discussion',
    discord: 'https://discord.gg/QfYWtWdqPS',
    medium: 'https://medium.com/gro-protocol',
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#fff',
});

@Register.AppDefinition(GRO_DEFINITION.id)
export class GroAppDefinition extends AppDefinition {
  constructor() {
    super(GRO_DEFINITION);
  }
}

export default GRO_DEFINITION;
