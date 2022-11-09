import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MIDAS_DEFINITION = appDefinition({
  id: 'midas',
  name: 'Midas',
  description:
    'Midas Capital is a cross-chain money market solution that unlocks and maximizes the usage of all digital assets and makes them work for you.',
  url: 'https://app.midascapital.xyz/',
  groups: {},
  tags: [AppTag.LENDING],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/MidasCapitalxyz',
    discord: 'https://discord.gg/85YxVuPeMt',
    telegram: 'https://t.me/midascapitaltg',
  },

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.MOONRIVER_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(MIDAS_DEFINITION.id)
export class MidasAppDefinition extends AppDefinition {
  constructor() {
    super(MIDAS_DEFINITION);
  }
}

export default MIDAS_DEFINITION;
