import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BANANO_DEFINITION = appDefinition({
  id: 'banano',
  name: 'Banano',
  description:
    'Banano is a feeless, instant, rich in potassium cryptocurrency powered by DAG technology disrupting the meme economy.',
  url: 'https://wrap.banano.cc',
  links: {
    github: 'https://github.com/BananoCoin',
    twitter: 'https://twitter.com/bananocoin',
    discord: 'http://chat.banano.cc/',
    telegram: 'https://t.me/banano_official',
    medium: 'https://medium.com/banano',
  },
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
  },
  tags: [],
  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [ProtocolAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
});

@Register.AppDefinition(BANANO_DEFINITION.id)
export class BananoAppDefinition extends AppDefinition {
  constructor() {
    super(BANANO_DEFINITION);
  }
}

export default BANANO_DEFINITION;
