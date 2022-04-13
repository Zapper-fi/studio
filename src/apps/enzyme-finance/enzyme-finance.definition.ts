import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ENZYME_FINANCE_DEFINITION = {
  id: 'enzyme-finance',
  name: 'enzyme-finance',
  description: '',
  groups: {
    vault: { id: 'vault', type: GroupType.TOKEN },
  },
  url: 'https://enzyme.finance/',
  tags: [ProtocolTag.ASSET_MANAGEMENT],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#8167e0',
};

@Register.AppDefinition(ENZYME_FINANCE_DEFINITION.id)
export class EnzymeFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(ENZYME_FINANCE_DEFINITION);
  }
}

export default ENZYME_FINANCE_DEFINITION;
