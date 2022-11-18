import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LEMMAFINANCE_DEFINITION = appDefinition({
  id: 'lemmafinance',
  name: 'LemmaFinance',
  description: 'A basis trading stablecoin protocol.',
  url: 'https://v2.lemma.finance/',

  groups: {
    usdl: {
      id: 'usdl',
      type: GroupType.TOKEN,
      label: 'USDL',
    },
  },

  tags: [AppTag.ALGORITHMIC_STABLECOIN],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(LEMMAFINANCE_DEFINITION.id)
export class LemmafinanceAppDefinition extends AppDefinition {
  constructor() {
    super(LEMMAFINANCE_DEFINITION);
  }
}

export default LEMMAFINANCE_DEFINITION;
