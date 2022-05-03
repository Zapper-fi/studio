import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ALPHA_V1_DEFINITION: AppDefinitionObject = {
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
  tags: [AppTag.LENDING, AppTag.FARMING],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(ALPHA_V1_DEFINITION.id)
export class AlphaV1AppDefinition extends AppDefinition {
  constructor() {
    super(ALPHA_V1_DEFINITION);
  }
}

export default ALPHA_V1_DEFINITION;
