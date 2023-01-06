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
  tags: [AppTag.ASSET_MANAGEMENT, AppTag.OPTIONS],
  keywords: [],

  links: {
    discord: 'https://discord.com/invite/polynomial',
    medium: 'https://medium.com/polynomial-protocol',
    twitter: 'https://twitter.com/polynomialfi',
  },

  groups: {
    callSellingVault: {
      id: 'call-selling-vault',
      type: GroupType.TOKEN,
      label: 'Call Selling Vaults',
    },

    callSellingVaultQueue: {
      id: 'call-selling-vault-queue',
      type: GroupType.POSITION,
      label: 'Call Selling Vault Queue',
    },

    putSellingVault: {
      id: 'put-selling-vault',
      type: GroupType.TOKEN,
      label: 'Put Selling Vaults',
    },

    putSellingVaultQueue: {
      id: 'put-selling-vault-queue',
      type: GroupType.POSITION,
      label: 'Put Selling Vault Queue',
    },
  },

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(POLYNOMIAL_DEFINITION.id)
export class PolynomialAppDefinition extends AppDefinition {
  constructor() {
    super(POLYNOMIAL_DEFINITION);
  }
}
