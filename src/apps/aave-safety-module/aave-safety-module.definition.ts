import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AAVE_SAFETY_MODULE_DEFINITION = appDefinition({
  id: 'aave-safety-module',
  name: 'Aave Safety Module',
  description: `The Aave Safety Module incentivizes Aave governance token holders to lock away their liquidity. This liquidity is used as a mitigation tool in the case of a shortfall event within the money markets belonging to the Aave ecosystem.`,
  url: 'https://aave.com/',
  tags: [AppTag.LIQUIDITY_POOL],
  primaryColor: '#1c1d26',

  links: {
    github: 'https://github.com/aave',
    twitter: 'https://twitter.com/AaveAave',
    discord: 'https://discord.gg/CvKUrqM',
    telegram: 'https://t.me/Aavesome',
    medium: 'https://medium.com/aave',
  },

  groups: {
    stkAave: {
      id: 'stk-aave',
      type: GroupType.TOKEN,
      label: 'stkAAVE',
    },

    stkAbpt: {
      id: 'stk-abpt',
      type: GroupType.TOKEN,
      label: 'stkABPT',
    },

    abpt: {
      id: 'abpt',
      type: GroupType.TOKEN,
      label: 'ABPT',
    },

    stkAbptClaimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'stkABPT Rewards',
    },

    stkAaveClaimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'stkAAVE Rewards',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(AAVE_SAFETY_MODULE_DEFINITION.id)
export class AaveSafetyModuleAppDefinition extends AppDefinition {
  constructor() {
    super(AAVE_SAFETY_MODULE_DEFINITION);
  }
}
