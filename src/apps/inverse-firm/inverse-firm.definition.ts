import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types';

export const INVERSE_FIRM_DEFINITION = appDefinition({
  id: 'inverse-firm',
  name: 'Inverse Finance - FiRM',
  description: `FiRM is a Fixed-Rate lending protocol by Inverse Finance which allows borrowing the DOLA stablecoin at a fixed-rate through the utility token named DOLA Borrowing Right (DBR).`,
  url: 'https://www.inverse.finance/firm',
  tags: [AppTag.YIELD_AGGREGATOR, AppTag.LENDING],
  links: {},

  groups: {
    loan: {
      id: 'loan',
      type: GroupType.POSITION,
      label: 'Lending',
    },
    dbr: {
      id: 'dbr',
      type: GroupType.POSITION,
      label: 'DBR',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(INVERSE_FIRM_DEFINITION.id)
export class InverseFirmAppDefinition extends AppDefinition {
  constructor() {
    super(INVERSE_FIRM_DEFINITION);
  }
}
