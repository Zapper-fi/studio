import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LEMMA_FINANCE_DEFINITION = appDefinition({
  id: 'lemma-finance',
  name: 'Lemma Finance',
  description: 'A basis trading stablecoin protocol.',
  url: 'https://v2.lemma.finance/',
  tags: [AppTag.ALGORITHMIC_STABLECOIN],
  keywords: [],

  links: {
    discord: 'https://discord.com/invite/AvCEkVbtQt',
    twitter: 'https://twitter.com/LemmaFinance',
  },

  groups: {
    usdl: {
      id: 'usdl',
      type: GroupType.TOKEN,
      label: 'USDL',
    },
    xUsdl: {
      id: 'x-usdl',
      type: GroupType.TOKEN,
      label: 'xUSDL',
    },
    synth: {
      id: 'synth',
      type: GroupType.TOKEN,
      label: 'Synth',
    },
    xSynth: {
      id: 'x-synth',
      type: GroupType.TOKEN,
      label: 'xSynth',
    },
  },

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(LEMMA_FINANCE_DEFINITION.id)
export class LemmaFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(LEMMA_FINANCE_DEFINITION);
  }
}
