import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AGAVE_DEFINITION = appDefinition({
  id: 'agave',
  name: 'agave',
  description:
    'Agave rewards depositors with passive income and lets them use their deposits as collateral to borrow and lend digital assets.',
  url: 'https://agave.finance/',
  groups: {},
  tags: [AppTag.COLLATERALIZED_DEBT_POSITION],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(AGAVE_DEFINITION.id)
export class AgaveAppDefinition extends AppDefinition {
  constructor() {
    super(AGAVE_DEFINITION);
  }
}

export default AGAVE_DEFINITION;
