import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolTag, ProtocolAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AELIN_DEFINITION = {
  id: 'aelin',
  name: 'Aelin',
  description: `Aelin is a fundraising protocol built on Ethereum and launched on Optimism.`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN },
    vAelin: { id: 'v-aelin', type: GroupType.TOKEN },
    farm: { id: 'farm', type: GroupType.POSITION },
  },
  url: 'https://aelin.xyz/',
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
