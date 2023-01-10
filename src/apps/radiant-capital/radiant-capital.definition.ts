import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const RADIANT_CAPITAL_DEFINITION = appDefinition({
  id: 'radiant-capital',
  name: 'Radiant Capital',
  description:
    'Radiant aims to be the first omnichain money market, where users can deposit any major asset on any major chain and borrow a variety of supported assets across multiple chains.',
  url: 'https://app.radiant.capital/',

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    stableDebt: {
      id: 'stable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    variableDebt: {
      id: 'variable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    platformFees: {
      id: 'platform-fees',
      type: GroupType.POSITION,
      label: 'Platform Fees',
    },
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/radiantcapital',
    telegram: 'https://t.me/radiantcapitalofficial',
    twitter: 'https://twitter.com/RDNTCapital',
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(RADIANT_CAPITAL_DEFINITION.id)
export class RadiantCapitalAppDefinition extends AppDefinition {
  constructor() {
    super(RADIANT_CAPITAL_DEFINITION);
  }
}

export default RADIANT_CAPITAL_DEFINITION;
