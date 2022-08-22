import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PIKA_PROTOCOL_DEFINITION = appDefinition({
  id: 'pika-protocol',
  name: 'Pika Protocol',
  description:
    'Pika Protocol is a decentralized perpetual swap exchange on Optimism, offering up to 50x leverage on any asset with deep liquidity',
  url: 'https://app.pikaprotocol.com',

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.POSITION,
      label: 'Vault',
    },
  },

  tags: [AppTag.PERPETUALS_EXCHANGE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(PIKA_PROTOCOL_DEFINITION.id)
export class PikaProtocolAppDefinition extends AppDefinition {
  constructor() {
    super(PIKA_PROTOCOL_DEFINITION);
  }
}

export default PIKA_PROTOCOL_DEFINITION;
