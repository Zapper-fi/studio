import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppTag, AppAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AELIN_DEFINITION = appDefinition({
  id: 'aelin',
  name: 'Aelin',
  description: `Aelin is a fundraising protocol built on Ethereum and launched on Optimism.`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    vAelin: { id: 'v-aelin', type: GroupType.TOKEN, label: 'vAELIN' },
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Staking' },
  },
  url: 'https://aelin.xyz/',
  links: {
    github: 'https://github.com/AelinXYZ',
    twitter: 'https://twitter.com/aelinprotocol',
    discord: 'https://t.co/kG6zsC0zaR',
    medium: 'https://medium.com/@aelinprotocol',
  },
  tags: [AppTag.LAUNCHPAD],
  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(AELIN_DEFINITION.id)
export class AelinAppDefinition extends AppDefinition {
  constructor() {
    super(AELIN_DEFINITION);
  }
}
