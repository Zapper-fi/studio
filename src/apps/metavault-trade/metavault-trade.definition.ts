import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const METAVAULT_TOKENS = {
  mvx: '0x2760e46d9bb43dafcbecaad1f64b93207f9f0ed7',
  mvlp: '0x9f4f8bc00f48663b7c204c96b932c29ccc43a2e8',
  esMvx: '0xd1b2f8dff8437be57430ee98767d512f252ead61',
};

export const METAVAULT_TRADE_DEFINITION = appDefinition({
  id: 'metavault-trade',
  name: 'Metavault.Trade',
  description:
    'Metavault.Trade is a new kind of Decentralised Exchange designed to provide a large range of trading features and very deep liquidity on many large cap crypto assets.',
  url: 'https://metavault.trade/',

  groups: {
    esMvx: {
      id: 'es-mvx',
      type: GroupType.TOKEN,
      label: 'esMVX',
      isHiddenFromExplore: true,
    },

    mvlp: {
      id: 'mvlp',
      type: GroupType.TOKEN,
      label: 'MVLP',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },

    option: {
      id: 'option',
      type: GroupType.POSITION,
      label: 'Options',
    },
  },

  tags: [AppTag.MARGIN_TRADING],
  keywords: [],
  links: {
    github: 'https://github.com/metavaultorg/',
    twitter: 'https://twitter.com/MetavaultTRADE/',
    discord: 'https://discord.gg/metavault',
    medium: 'https://medium.com/@metavault.trade',
    telegram: 'https://t.me/MetavaultTrade/',
  },

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#FFAA27',
  token: {
    address: '0x2760e46d9bb43dafcbecaad1f64b93207f9f0ed7',
    network: Network.POLYGON_MAINNET,
  },
});

@Register.AppDefinition(METAVAULT_TRADE_DEFINITION.id)
export class MetavaultTradeAppDefinition extends AppDefinition {
  constructor() {
    super(METAVAULT_TRADE_DEFINITION);
  }
}

export default METAVAULT_TRADE_DEFINITION;
