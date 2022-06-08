import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const VOTIUM_DEFINITION = appDefinition({
  id: 'votium',
  name: 'Votium',
  description: 'Earn rewards for your veCRV & vlCVX votes',
  url: 'https://votium.app',

  groups: {
    rewards: {
      id: 'rewards',
      type: GroupType.TOKEN,
      label: 'Rewards',
    },
  },

  tags: [AppTag.FARMING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(VOTIUM_DEFINITION.id)
export class VotiumAppDefinition extends AppDefinition {
  constructor() {
    super(VOTIUM_DEFINITION);
  }
}

export default VOTIUM_DEFINITION;
