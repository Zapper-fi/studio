import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KOYO_DEFINITION = appDefinition({
  id: 'koyo',
  name: 'Kōyō Finance',
  description:
    'Kōyō is a AMM protocol based on Balancer aimed at providing stable pools alongside variable rate, multi token pools.',
  url: 'https://koyo.finance',
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  keywords: [],

  links: {
    github: 'https://github.com/koyo-finance/',
    twitter: 'https://twitter.com/koyofinance/',
    discord: 'https://docs.koyo.finance/discord/',
  },

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
    [Network.MOONRIVER_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(KOYO_DEFINITION.id)
export class KoyoAppDefinition extends AppDefinition {
  constructor() {
    super(KOYO_DEFINITION);
  }
}

export default KOYO_DEFINITION;
