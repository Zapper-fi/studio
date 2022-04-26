import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const TEDDY_CASH_DEFINITION = {
  id: 'teddy-cash',
  name: 'Teddy Cash',
  description: 'Borrow up to 90% on your AVAX with Teddy, a decentralized borrowing protocol on Avalanche',
  url: 'https://teddy.cash/',
  links: {
    github: '',
    twitter: '',
    discord: '',
    telegram: '',
  },
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
    trove: { id: 'trove', type: GroupType.POSITION },
    stabilityPool: { id: 'stability-pool', type: GroupType.POSITION },
  },
  tags: [ProtocolTag.LENDING],
  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(TEDDY_CASH_DEFINITION.id)
export class TeddyCashAppDefinition extends AppDefinition {
  constructor() {
    super(TEDDY_CASH_DEFINITION);
  }
}

export default TEDDY_CASH_DEFINITION;
