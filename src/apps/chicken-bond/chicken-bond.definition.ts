import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CHICKEN_BOND_DEFINITION = appDefinition({
  id: 'chicken-bond',
  name: 'Chicken Bond',
  description: `A novel bonding mechanism - first applied to Liquity LUSD.`,
  url: 'https://botto.com/',
  tags: [AppTag.BONDS],
  links: {
    discord: 'https://discord.com/invite/5HXTuqeajm',
    twitter: 'https://twitter.com/ChickenBonds',
  },

  groups: {
    bond: {
      id: 'bond',
      type: GroupType.POSITION,
      label: 'Bond',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(CHICKEN_BOND_DEFINITION.id)
export class ChickenBondAppDefinition extends AppDefinition {
  constructor() {
    super(CHICKEN_BOND_DEFINITION);
  }
}
