import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const UNAGII_DEFINITION = appDefinition({
  id: 'unagii',
  name: 'Unagii',
  description: `Unagii is a non-custodial yield platform that empowers crypto asset owners with access to Decentralized Finance (DeFi) yields on a smart, simple, and user-friendly interface.`,
  groups: {
    vault: { id: 'vault', type: GroupType.TOKEN },
  },
  url: 'https://www.unagii.com/',
  links: {
    github: 'https://github.com/stakewithus',
    twitter: 'https://twitter.com/unagiidotcom',
    telegram: 'https://t.me/unagiidotcom',
  },
  tags: [ProtocolTag.YIELD_AGGREGATOR],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
});

@Register.AppDefinition(UNAGII_DEFINITION.id)
export class UnagiiAppDefinition extends AppDefinition {
  constructor() {
    super(UNAGII_DEFINITION);
  }
}

export default UNAGII_DEFINITION;
