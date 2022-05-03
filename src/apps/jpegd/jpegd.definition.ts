import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const JPEGD_DEFINITION: AppDefinitionObject = {
  id: 'jpegd',
  name: 'Jpegd',
  description: 'JPEGd is the leading NFT lending platform in the decentralized finance space.',
  url: 'https://jpegd.io/',
  links: {
    twitter: 'https://twitter.com/JPEGd_69',
    discord: 'https://discord.com/invite/jpegd',
    telegram: 'https://t.me/jpegd',
    medium: 'https://medium.com/@jpegd',
  },
  groups: {
    pool: { id: 'pool', type: GroupType.POSITION },
    bond: { id: 'bond', type: GroupType.POSITION },
  },
  tags: [AppTag.COLLATERALIZED_DEBT_POSITION],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(JPEGD_DEFINITION.id)
export class JpegdAppDefinition extends AppDefinition {
  constructor() {
    super(JPEGD_DEFINITION);
  }
}

export default JPEGD_DEFINITION;
