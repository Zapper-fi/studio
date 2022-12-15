import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const APECOIN_DEFINITION = appDefinition({
  id: 'apecoin',
  name: 'Apecoin',
  description: 'APE is a token made to support what’s next, controlled and built on by the community.',
  url: 'https://apecoin.com/',

  groups: {
    staking: {
      id: 'staking',
      type: GroupType.POSITION,
      label: 'Staking',
    },
  },

  tags: [AppTag.STAKING],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/apecoin',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(APECOIN_DEFINITION.id)
export class ApecoinAppDefinition extends AppDefinition {
  constructor() {
    super(APECOIN_DEFINITION);
  }
}

export default APECOIN_DEFINITION;
