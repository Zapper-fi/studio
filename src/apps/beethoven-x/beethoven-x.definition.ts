import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppTag, AppAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BEETHOVEN_X_DEFINITION = appDefinition({
  id: 'beethoven-x',
  name: 'Beethoven-X',
  description: `Beethoven X enables secure and efficient - high speed, low cost - trading. Start trading immediately, no registration required. Just connect your wallet and you’re good to go.`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN },
    farm: { id: 'farm', type: GroupType.POSITION },
    fBeets: { id: 'fBEETS', type: GroupType.TOKEN },
  },
  url: 'https://app.beets.fi/',
  links: {
    github: 'https://github.com/beethovenxfi',
    twitter: 'https://twitter.com/beethoven_x',
    discord: 'https://discord.com/invite/jedS4zGk28',
    medium: 'https://beethovenxio.medium.com',
    learn: 'https://docs.beets.fi',
  },
  tags: [AppTag.YIELD_AGGREGATOR],
  supportedNetworks: { [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW] },
  token: {
    address: '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
    network: Network.FANTOM_OPERA_MAINNET,
  },
});

@Register.AppDefinition(BEETHOVEN_X_DEFINITION.id)
export class BeethovenXAppDefinition extends AppDefinition {
  constructor() {
    super(BEETHOVEN_X_DEFINITION);
  }
}
