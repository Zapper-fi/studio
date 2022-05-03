import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const TOKEMAK_DEFINITION = appDefinition({
  id: 'tokemak',
  name: 'Tokemak',
  description: `Tokemak creates sustainable DeFi liquidity and capital efficient markets through a convenient decentralized market making protocol.`,
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
    reactor: { id: 'reactor', type: GroupType.TOKEN },
  },
  url: 'https://www.tokemak.xyz/',
  links: {
    github: 'https://github.com/Tokemak',
    twitter: 'https://twitter.com/tokenreactor',
    discord: 'https://discord.com/invite/Z5f92tfzh4',
    medium: 'https://medium.com/tokemak',
  },
  tags: [ProtocolTag.LIQUIDITY_POOL],
  supportedNetworks: { [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW] },
});

@Register.AppDefinition(TOKEMAK_DEFINITION.id)
export class TokemakAppDefinition extends AppDefinition {
  constructor() {
    super(TOKEMAK_DEFINITION);
  }
}
