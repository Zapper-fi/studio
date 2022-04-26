import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const NAOS_DEFINITION = {
  id: 'naos',
  name: 'NAOS Finance',
  description: `Earn competitive yield from income generating real world financial assets.`,
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
  },
  url: 'https://naos.finance/',
  tags: [ProtocolTag.LENDING],
  supportedNetworks: { [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW] },
};

@Register.AppDefinition(NAOS_DEFINITION.id)
export class NaosAppDefinition extends AppDefinition {
  constructor() {
    super(NAOS_DEFINITION);
  }
}
