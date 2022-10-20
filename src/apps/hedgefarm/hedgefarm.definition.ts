import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HEDGEFARM_DEFINITION = appDefinition({
  id: 'hedgefarm',
  name: 'HedgeFarm',
  description: 'A DeFi protocol that provides alpha yield vaults for your crypto.',
  url: 'hedgefarm.finance',

  groups: {
    alphaOne: {
      id: 'alpha-one',
      type: GroupType.TOKEN,
      label: 'Alpha #1',
    },
  },

  tags: [AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(HEDGEFARM_DEFINITION.id)
export class HedgefarmAppDefinition extends AppDefinition {
  constructor() {
    super(HEDGEFARM_DEFINITION);
  }
}

export default HEDGEFARM_DEFINITION;
