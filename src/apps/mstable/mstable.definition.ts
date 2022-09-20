import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MSTABLE_DEFINITION = appDefinition({
  id: 'mstable',
  name: 'mStable',
  description: `mStable is an autonomous and non-custodial infrastructure for pegged-value crypto assets.`,
  url: 'https://mstable.org/',
  groups: {
    imusd: {
      id: 'imusd',
      type: GroupType.TOKEN,
      label: 'imUSD',
    },

    savingsVault: {
      id: 'save',
      type: GroupType.POSITION,
      label: 'Savings Vault',
    },

    mtaV1Farm: {
      id: 'mta-v1-farm',
      type: GroupType.POSITION,
      label: 'MTA Staking V1',
      isHiddenFromExplore: true,
    },

    mtaV2Farm: {
      id: 'mta-v2-farm',
      type: GroupType.POSITION,
      label: 'MTA Staking V2',
    },

    earn: {
      id: 'earn',
      type: GroupType.POSITION,
      label: 'Earn',
      isHiddenFromExplore: true,
    },
  },
  tags: [AppTag.ASSET_MANAGEMENT],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
  links: {
    twitter: 'https://twitter.com/mstable_',
    discord: 'https://discord.com/invite/pgCVG7e',
    medium: 'https://medium.com/mstable',
    github: 'https://github.com/mstable',
  },
});

@Register.AppDefinition(MSTABLE_DEFINITION.id)
export class MstableAppDefinition extends AppDefinition {
  constructor() {
    super(MSTABLE_DEFINITION);
  }
}
