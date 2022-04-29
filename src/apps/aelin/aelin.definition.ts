import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolTag, ProtocolAction, AppDefinitionObject } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AELIN_DEFINITION: AppDefinitionObject = {
  id: 'aelin',
  name: 'Aelin',
  description: `Aelin is a fundraising protocol built on Ethereum and launched on Optimism.`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN },
    vAelin: { id: 'v-aelin', type: GroupType.TOKEN },
    farm: { id: 'farm', type: GroupType.POSITION },
  },
  url: 'https://aelin.xyz/',
  links: {
    github: 'https://github.com/AelinXYZ',
    twitter: 'https://twitter.com/aelinprotocol',
    discord: 'https://t.co/kG6zsC0zaR',
    medium: 'https://medium.com/@aelinprotocol',
  },
  tags: [ProtocolTag.LENDING],
  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [ProtocolAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
};

@Register.AppDefinition(AELIN_DEFINITION.id)
export class AelinAppDefinition extends AppDefinition {
  constructor() {
    super(AELIN_DEFINITION);
  }
}
