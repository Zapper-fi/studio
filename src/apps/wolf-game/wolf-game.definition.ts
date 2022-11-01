import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const WOLF_GAME_DEFINITION = appDefinition({
  id: 'wolf-game',
  name: 'Wolf Game',
  description:
    'A risky blockchain-based game between Sheep and Wolves. Together, we are building a world of strategy and game theory, ruled by the Wolves.',
  url: 'https://wolf.game',
  tags: [AppTag.GAMING],
  primaryColor: '#fff',
  keywords: [],

  links: {},

  groups: {
    woolPouch: {
      id: 'wool-pouch',
      type: GroupType.POSITION,
      label: 'Wool Pouches',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(WOLF_GAME_DEFINITION.id)
export class WolfGameAppDefinition extends AppDefinition {
  constructor() {
    super(WOLF_GAME_DEFINITION);
  }
}

export default WOLF_GAME_DEFINITION;
