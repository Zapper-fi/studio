import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const IQ_DEFINITION = appDefinition({
  id: 'iq',
  name: 'IQ',
  description: 'The worlds largest blockchain and crypto encyclopedia',
  url: 'https://iq.wiki/',

  groups: {
    hiiq: {
      id: 'hiiq',
      type: GroupType.TOKEN,
      label: 'HiIQ',
    },
  },

  tags: [AppTag.BRIDGE, AppTag.STAKING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(IQ_DEFINITION.id)
export class IqAppDefinition extends AppDefinition {
  constructor() {
    super(IQ_DEFINITION);
  }
}

export default IQ_DEFINITION;
