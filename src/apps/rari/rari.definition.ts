import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types';

export const RARI_DEFINITION = appDefinition({
  id: 'rari',
  name: 'Rari',
  description: `Rari Capital opens up the world to financial innovation on an unprecedented scale. Earn. Deposit crypto-assets to automatically begin earning the highest yield.`,
  url: 'https://rari.capital/',
  tags: [AppTag.FUND_MANAGER],

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },

    fund: {
      id: 'fund',
      type: GroupType.TOKEN,
      label: 'Funds',
    },

    governance: {
      id: 'governance',
      type: GroupType.POSITION,
      label: 'Governance',
    },
  },
  links: {
    discord: 'https://discord.com/invite/T9Yrd7MGSP',
    medium: 'https://medium.com/rari-capital',
    twitter: 'https://twitter.com/RariCapital',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(RARI_DEFINITION.id)
export class RariAppDefinition extends AppDefinition {
  constructor() {
    super(RARI_DEFINITION);
  }
}
