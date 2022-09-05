import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const REDACTED_CARTEL_DEFINITION = appDefinition({
  id: 'redacted-cartel',
  name: 'Redacted Cartel',
  description: `[REDACTED]`,
  url: 'https://www.redactedcartel.xyz/',
  tags: [AppTag.ELASTIC_FINANCE],
  links: {},

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
