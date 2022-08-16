import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const INDEX_COOP_DEFINITION = appDefinition({
  id: 'index-coop',
  name: 'Index Coop',
  description: `Index Coop is a Decentralized and Autonomous Asset Manager governed, maintained, and upgraded by INDEX token holders.`,
  url: 'https://www.indexcoop.com/',
  tags: [AppTag.ASSET_MANAGEMENT],
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Staking' },
    index: { id: 'index', type: GroupType.TOKEN, label: 'Index' },
  },
  supportedNetworks: { [Network.ETHEREUM_MAINNET]: [AppAction.VIEW] },
  links: {
    twitter: 'https://twitter.com/indexcoop',
    discord: 'https://discord.com/invite/BcqYxdNC3R',
  },
});

@Register.AppDefinition(INDEX_COOP_DEFINITION.id)
export class IndexCoopAppDefinition extends AppDefinition {
  constructor() {
    super(INDEX_COOP_DEFINITION);
  }
}

export default INDEX_COOP_DEFINITION;
