import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MARKET_XYZ_DEFINITION = appDefinition({
  id: 'market-xyz',
  name: 'Market',
  description: 'Earn yield & leverage assets on your terms',
  url: 'https://www.market.xyz/',

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
      groupLabel: 'Supply',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Lending',
      groupLabel: 'Borrow',
    },
  },

  tags: [AppTag.LIQUIDITY_POOL],
  keywords: [],

  links: {
    github: 'https://github.com/marketxyz',
    twitter: 'https://twitter.com/market_xyz',
    discord: 'https://discord.gg/u9r2nZ5R3p',
  },

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(MARKET_XYZ_DEFINITION.id)
export class MarketXyzAppDefinition extends AppDefinition {
  constructor() {
    super(MARKET_XYZ_DEFINITION);
  }
}

export default MARKET_XYZ_DEFINITION;
