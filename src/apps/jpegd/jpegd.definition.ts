import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const JPEGD_DEFINITION = {
  id: 'jpegd',
  name: 'Jpegd',
  description: 'JPEGd is the leading NFT lending platform in the decentralized finance space.',
  url: 'https://jpegd.io/',
  links: {
    github: '',
    twitter: '',
    discord: '',
    telegram: '',
  },
  groups: {
    pool: { id: 'pool', type: GroupType.POSITION },
    bond: { id: 'bond', type: GroupType.POSITION },
  },
  tags: [ProtocolTag.LENDING],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(JPEGD_DEFINITION.id)
export class JpegdAppDefinition extends AppDefinition {
  constructor() {
    super(JPEGD_DEFINITION);
  }
}

export default JPEGD_DEFINITION;
