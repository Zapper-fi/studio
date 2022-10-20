import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const REAPER_DEFINITION = appDefinition({
  id: 'reaper',
  name: 'Reaper',
  description: `Reaper is a passive money multiplier on the Fantom network.`,
  url: 'https://www.reaper.farm/',
  tags: [AppTag.YIELD_AGGREGATOR],
  links: {},

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'Vaults',
    },
  },

  supportedNetworks: {
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(REAPER_DEFINITION.id)
export class ReaperAppDefinition extends AppDefinition {
  constructor() {
    super(REAPER_DEFINITION);
  }
}
