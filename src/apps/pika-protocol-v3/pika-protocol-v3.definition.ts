import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PIKA_PROTOCOL_V_3_DEFINITION = appDefinition({
  id: 'pika-protocol-v3',
  name: 'Pika Protocol V3',
  description:
    'Pika Protocol is a decentralized perpetual swap exchange on Optimism, offering up to 50x leverage on any asset with deep liquidity',
  url: 'https://www.pikaprotocol.com/',
  groups: {},
  tags: [AppTag.PERPETUALS_EXCHANGE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(PIKA_PROTOCOL_V_3_DEFINITION.id)
export class PikaProtocolV3AppDefinition extends AppDefinition {
  constructor() {
    super(PIKA_PROTOCOL_V_3_DEFINITION);
  }
}

export default PIKA_PROTOCOL_V_3_DEFINITION;
