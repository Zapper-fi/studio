import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BOTTO_DEFINITION = appDefinition({
  id: 'botto',
  name: 'Botto',
  description: `A decentralized artist that generates art based on community feedback`,
  url: 'https://botto.com/',
  tags: [AppTag.ASSET_MANAGEMENT],
  links: {},

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },

    governance: {
      id: 'governance',
      type: GroupType.POSITION,
      label: 'Governance',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(BOTTO_DEFINITION.id)
export class BottoAppDefinition extends AppDefinition {
  constructor() {
    super(BOTTO_DEFINITION);
  }
}
