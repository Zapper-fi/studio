import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

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
      groupLabel: 'Escrow',
      isHiddenFromExplore: true,
    },

    mvlp: {
      id: 'mvlp',
      type: GroupType.TOKEN,
      label: 'MVLP',
      groupLabel: 'Liquidity',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
      groupLabel: 'Farms',
    },

    option: {
      id: 'option',
      type: GroupType.POSITION,
      label: 'Options',
      groupLabel: 'Options',
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
