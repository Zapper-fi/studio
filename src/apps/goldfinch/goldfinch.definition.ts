import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types';

export const GOLDFINCH_DEFINITION = appDefinition({
  id: 'goldfinch',
  name: 'Goldfinch',
  description: `Use DeFi's global credit marketplace to harness sustainable APYs from businesses creating real value in the world.`,
  url: 'https://goldfinch.finance/',

  links: {
    discord: 'https://discord.com/invite/HVeaca3fN8',
    github: 'https://github.com/goldfinch-eng',
    medium: 'https://medium.com/goldfinch-fi',
    twitter: 'https://twitter.com/goldfinch_fi',
  },

  groups: {
    fidu: {
      id: 'fidu',
      label: 'FIDU',
      type: GroupType.TOKEN,
    },

    seniorBond: {
      id: 'senior-bond',
      label: 'Staking',
      type: GroupType.POSITION,
    },

    vault: {
      id: 'vault',
      label: 'Membership',
      type: GroupType.POSITION,
    },
  },

  tags: [AppTag.ASSET_MANAGEMENT],

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(GOLDFINCH_DEFINITION.id)
export class GoldfinchAppDefinition extends AppDefinition {
  constructor() {
    super(GOLDFINCH_DEFINITION);
  }
}
