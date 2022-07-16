import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PIREX_DEFINITION = appDefinition({
  id: 'pirex',
  name: 'Pirex',
  description:
    'Pirex is a new incentives platform for vlCVX holders that introduces exotic liquidity for bribes and vote escrow tokens.',
  url: 'https://pirex.io/',

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'Vault',
    },
  },

  tags: [AppTag.FARMING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(PIREX_DEFINITION.id)
export class PirexAppDefinition extends AppDefinition {
  constructor() {
    super(PIREX_DEFINITION);
  }
}

export default PIREX_DEFINITION;
