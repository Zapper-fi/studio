import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HOMORA_V_2_DEFINITION = appDefinition({
  id: 'homora-v2',
  name: 'Homora V2',
  description:
    'Homora V2 is DeFi’s first multi-chain leveraged yield farming and lending protocol. Your home of yield boosting is now available on Ethereum, Fantom, Avalanche, and Optimism.',
  url: 'https://homora-v2.alphaventuredao.io/',
  groups: {
    lending: { id: 'lending', type: GroupType.TOKEN, label: 'Lending' },
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },
  tags: [AppTag.CROSS_CHAIN, AppTag.FARMING, AppTag.LENDING],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/Alpha_HomoraV2',
    discord: 'https://discord.gg/XyPe2yw3',
    telegram: 'https://t.me/AlphaFinanceLab',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(HOMORA_V_2_DEFINITION.id)
export class HomoraV2AppDefinition extends AppDefinition {
  constructor() {
    super(HOMORA_V_2_DEFINITION);
  }
}

export default HOMORA_V_2_DEFINITION;
