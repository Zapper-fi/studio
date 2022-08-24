import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ARTH_DEFINITION = appDefinition({
  id: 'arth',
  name: 'ARTH',
  description:
    'ARTH is a stablecoin that is designed to appreciate over time against the US dollar while at the same time, it remains relatively stable.',
  url: 'https://arth.mahadao.com/',

  groups: {
    trove: {
      id: 'trove',
      type: GroupType.POSITION,
      label: 'Trove',
    },

    stabilityPool: {
      id: 'stability-pool',
      type: GroupType.POSITION,
      label: 'Stability Pool',
    },
  },

  tags: [AppTag.COLLATERALIZED_DEBT_POSITION],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ARTH_DEFINITION.id)
export class ArthAppDefinition extends AppDefinition {
  constructor() {
    super(ARTH_DEFINITION);
  }
}

export default ARTH_DEFINITION;
