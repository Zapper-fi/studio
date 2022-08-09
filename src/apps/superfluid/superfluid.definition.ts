import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SUPERFLUID_DEFINITION = appDefinition({
  id: 'superfluid',
  name: 'Superfluid',
  description: `Programmable money streams on Ethereum`,
  groups: {
    vault: { id: 'vault', type: GroupType.TOKEN, label: 'Vaults' },
  },
  url: 'https://www.superfluid.finance/',
  links: {
    github: 'https://github.com/superfluid-finance',
  },
  tags: [AppTag.PAYMENTS],
  supportedNetworks: { [Network.POLYGON_MAINNET]: [AppAction.VIEW] },
});

@Register.AppDefinition(SUPERFLUID_DEFINITION.id)
export class SuperfluidAppDefinition extends AppDefinition {
  constructor() {
    super(SUPERFLUID_DEFINITION);
  }
}

export default SUPERFLUID_DEFINITION;
