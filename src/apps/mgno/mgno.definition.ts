import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MGNO_DEFINITION = {
  id: 'mgno',
  name: 'mgno',
  description: 'Metatoken GNO used for staking Gnosis Beacon Chain',
  url: 'https://docs.gnosischain.com',
  groups: {
    token: { id: 'token', type: GroupType.TOKEN },
    staking: { id: 'staking', type: GroupType.POSITION },
    locked: { id: 'locked', type: GroupType.POSITION },
    liquidstaking: { id: 'liquidstaking', type: GroupType.POSITION },
    liquidstakingreward: { id: 'liquidstakingreward', type: GroupType.POSITION },
  },
  tags: [],
  supportedNetworks: {
    [Network.GNOSIS_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(MGNO_DEFINITION.id)
export class MgnoAppDefinition extends AppDefinition {
  constructor() {
    super(MGNO_DEFINITION);
  }
}

export default MGNO_DEFINITION;
