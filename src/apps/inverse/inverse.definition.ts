import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types';

export const INVERSE_DEFINITION = appDefinition({
  id: 'inverse',
  name: 'Inverse Finance',
  description: `Inverse.finance is a suite of permissionless decentralized finance tools governed by Inverse DAO, a decentralized autonomous organization running on the Ethereum blockchain.`,
  url: 'https://www.inverse.finance/',
  tags: [AppTag.YIELD_AGGREGATOR, AppTag.LENDING],
  links: {},

  groups: {
    dcaVault: {
      id: 'dca-vault',
      type: GroupType.TOKEN,
      label: 'DCA Vaults',
    },

    dcaVaultDividend: {
      id: 'dca-vault-dividend',
      type: GroupType.POSITION,
      label: 'DCA Vault Dividends',
    },

    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Lending',
    },

    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Rewards',
      isHiddenFromExplore: true,
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(INVERSE_DEFINITION.id)
export class InverseAppDefinition extends AppDefinition {
  constructor() {
    super(INVERSE_DEFINITION);
  }
}
