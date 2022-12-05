import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const REDACTED_CARTEL_DEFINITION = appDefinition({
  id: 'redacted-cartel',
  name: 'Redacted',
  description: `The Redacted ecosystem is a product suite of smart contracts empowering on-chain liquidity, governance, and cash flow for DeFi protocols.`,
  url: 'https://www.redacted.finance/',
  primaryColor: '#27A5F2',
  tags: [AppTag.ELASTIC_FINANCE],
  keywords: ['redacted', 'services', 'real yield'],
  links: {
    learn: 'https://docs.redacted.finance/',
    github: 'https://github.com/redacted-cartel/',
    twitter: 'https://twitter.com/redactedcartel',
    discord: 'https://discord.com/invite/RwghRM6Shf',
  },

  groups: {
    bond: {
      id: 'bond',
      type: GroupType.POSITION,
      label: 'Bond',
    },

    revenueLock: {
      id: 'revenue-lock',
      type: GroupType.POSITION,
      label: 'Revenue Lock',
    },

    xBtrfly: {
      id: 'x-btrfly',
      type: GroupType.TOKEN,
      label: 'xBTFRLY',
    },

    wxBtrfly: {
      id: 'wx-btrfly',
      type: GroupType.TOKEN,
      label: 'wxBTRFLY',
    },

    wxBtrflyV1: {
      id: 'wx-btrfly-v1',
      type: GroupType.TOKEN,
      label: 'wxBTRFLY (v1)',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(REDACTED_CARTEL_DEFINITION.id)
export class RedactedCartelAppDefinition extends AppDefinition {
  constructor() {
    super(REDACTED_CARTEL_DEFINITION);
  }
}
