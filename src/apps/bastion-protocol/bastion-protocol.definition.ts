import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BASTION_PROTOCOL_DEFINITION = appDefinition({
  id: 'bastion-protocol',
  name: 'Bastion',
  description: 'Liquidity Foundation of Aurora',
  url: 'https://bastionprotocol.com/',

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Supply',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.TOKEN,
      label: 'Borrow',
    },

    swap: {
      id: 'swap',
      type: GroupType.TOKEN,
      label: 'Stableswap Pools',
    },
  },

  tags: [AppTag.LENDING, AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(BASTION_PROTOCOL_DEFINITION.id)
export class BastionProtocolAppDefinition extends AppDefinition {
  constructor() {
    super(BASTION_PROTOCOL_DEFINITION);
  }
}

export default BASTION_PROTOCOL_DEFINITION;
