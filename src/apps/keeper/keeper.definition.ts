import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KEEPER_DEFINITION = appDefinition({
  id: 'keeper',
  name: 'Keep3r',
  description: 'Keep3r',
  url: 'https://keep3r.network/',
  tags: [AppTag.BONDS, AppTag.INFRASTRUCTURE],
  keywords: [],
  links: {},

  groups: {
    klp: {
      id: 'klp',
      type: GroupType.TOKEN,
      label: 'Keep3r LP',
    },

    job: {
      id: 'job',
      type: GroupType.POSITION,
      label: 'Job',
    },

    bond: {
      id: 'bond',
      type: GroupType.POSITION,
      label: 'Keep3r Bond',
    },

    unbond: {
      id: 'unbond',
      type: GroupType.POSITION,
      label: 'Keep3r Unbond',
    },

    vest: {
      id: 'vest',
      type: GroupType.POSITION,
      label: 'Vesting',
    },

    redeemable: {
      id: 'redeemable',
      type: GroupType.TOKEN,
      label: 'rKP3R',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(KEEPER_DEFINITION.id)
export class KeeperAppDefinition extends AppDefinition {
  constructor() {
    super(KEEPER_DEFINITION);
  }
}
