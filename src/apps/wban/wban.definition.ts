import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const WBAN_DEFINITION = {
  id: 'wban',
  name: 'wBAN',
  description: 'Wrapped Banano',
  url: 'https://wrap.banano.cc',
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
  },
  tags: [],
  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [ProtocolAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(WBAN_DEFINITION.id)
export class WbanAppDefinition extends AppDefinition {
  constructor() {
    super(WBAN_DEFINITION);
  }
}

export default WBAN_DEFINITION;
