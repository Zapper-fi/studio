import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const B_PROTOCOL_DEFINITION = appDefinition({
  id: 'b-protocol',
  name: 'B.Protocol',
  description: `B.Protocol is a backstop protocol which BPRO holders govern. Users of the protocol have access to all the benefits of MakerDAO and Compound (soon Aave), with the additional benefit of splitting liquidation proceeds according to proportional usage of the protocol.`,
  groups: {
    deposit: { id: 'deposit', type: GroupType.POSITION, label: 'Lending' },
  },
  url: 'https://www.bprotocol.org/',
  links: {
    twitter: 'https://twitter.com/bprotocoleth',
    discord: 'https://discord.com/invite/bJ4guuw',
    medium: 'https://medium.com/b-protocol',
    github: 'https://github.com/backstop-protocol',
  },
  tags: [AppTag.LENDING],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(B_PROTOCOL_DEFINITION.id)
export class BProtocolAppDefinition extends AppDefinition {
  constructor() {
    super(B_PROTOCOL_DEFINITION);
  }
}

export default B_PROTOCOL_DEFINITION;
