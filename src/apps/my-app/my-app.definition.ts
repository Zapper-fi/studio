import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MY_APP_DEFINITION = {
  id: 'my-app',
  name: 'my-app',
  description: 'My app is pretty decent',
  tags: [ProtocolTag.LENDING],
  groups: {
    pool: { id: 'pool', network: Network.ETHEREUM_MAINNET } as const,
  } as const,
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW, ProtocolAction.TRANSACT],
  },
  primaryColor: '#1c1d26',
  url: 'https://my-app.com/',
  token: {
    address: '0x0000000000000000000000000000000000000000',
    network: Network.ETHEREUM_MAINNET,
  },
};

@Register.AppDefinition(MY_APP_DEFINITION.id)
export class MyAppAppDefinition extends AppDefinition {
  constructor() {
    super(MY_APP_DEFINITION);
  }
}
