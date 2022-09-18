import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ARTH_DEFINITION = appDefinition({
  id: 'arth',
  name: 'ARTH',
  description:
    'ARTH is a decentralized stablecoin that is designed to appreciate over time against the US dollar whilst remaining relatively stable.',
  url: 'https://arth.mahadao.com/',

  groups: {
    trove: {
      id: 'trove',
      type: GroupType.POSITION,
      label: 'Loans',
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

  primaryColor: '#222',
});

@Register.AppDefinition(ARTH_DEFINITION.id)
export class ArthAppDefinition extends AppDefinition {
  constructor() {
    super(ARTH_DEFINITION);
  }
}

export default ARTH_DEFINITION;
