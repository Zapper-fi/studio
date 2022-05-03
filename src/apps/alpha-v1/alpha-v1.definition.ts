import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ALPHA_V1_DEFINITION = appDefinition({
  id: 'alpha-v1',
  name: 'Alpha',
  description: `Alpha Homora is a leveraged yield farming leveraged liquidity providing protocol. Lenders can earn high interest, and yield farmers can get even higher farming APY and trading fees through leverage. This project is deprecated in favour of V2.`,
  groups: {
    lending: { id: 'lending', type: GroupType.TOKEN },
  },
  url: 'https://homora.alphafinance.io/',
  links: {
    twitter: 'https://twitter.com/alphafinancelab',
    discord: 'https://discord.com/invite/2My6wKt',
    telegram: 'https://t.me/AlphaFinanceLab',
  },
  tags: [ProtocolTag.LENDING],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
});

@Register.AppDefinition(ALPHA_V1_DEFINITION.id)
export class AlphaV1AppDefinition extends AppDefinition {
  constructor() {
    super(ALPHA_V1_DEFINITION);
  }
}

export default ALPHA_V1_DEFINITION;
