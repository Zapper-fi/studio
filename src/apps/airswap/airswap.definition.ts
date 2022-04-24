import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AIRSWAP_DEFINITION = {
  id: 'airswap',
  name: 'Airswap',
  description:
    'AirSwap is an open community of developers, designers, writers, and tinkerers building decentralized trading systems. Protocol fees are automatically distributed to contributors.',
  url: 'https://airswap.io',
  groups: {
    AST: {id: 'ast', type: GroupType.TOKEN},
    sAST: {id: 's-ast', type: GroupType.TOKEN},
  },
  tags: [ProtocolTag.EXCHANGE],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#2B71FF',
};

@Register.AppDefinition(AIRSWAP_DEFINITION.id)
export class AirswapAppDefinition extends AppDefinition {
  constructor() {
    super(AIRSWAP_DEFINITION);
  }
}

export default AIRSWAP_DEFINITION;
