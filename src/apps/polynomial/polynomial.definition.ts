import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const POLYNOMIAL_DEFINITION = appDefinition({
  id: 'polynomial',
  name: 'Polynomial Protocol',
  description:
    'Polynomial automates financial derivative strategies to create products that deliver passive yield on various assets.',
  url: 'https://earn.polynomial.fi/',
  groups: {
    vaults: {
      id: 'vaults',
      type: GroupType.TOKEN,
      label: 'Vaults',
    },
  },
  tags: [AppTag.ASSET_MANAGEMENT, AppTag.OPTIONS],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(POLYNOMIAL_DEFINITION.id)
export class PolynomialAppDefinition extends AppDefinition {
  constructor() {
    super(POLYNOMIAL_DEFINITION);
  }
}

export default POLYNOMIAL_DEFINITION;
