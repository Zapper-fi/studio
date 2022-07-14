import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const VELODROME_DEFINITION = appDefinition({
  id: 'velodrome',
  name: 'Velodrome',
  description: 'The liquidity base-layer of the Optimism ecosystem.',
  url: 'https://app.velodrome.finance',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
    farm: {
      id: 'farm',
      type: GroupType.TOKEN,
      label: 'Staking',
    },
    votingEscrow: { id: 'voting-escrow', type: GroupType.POSITION, label: 'Voting Escrow' },
  },

  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(VELODROME_DEFINITION.id)
export class VelodromeAppDefinition extends AppDefinition {
  constructor() {
    super(VELODROME_DEFINITION);
  }
}

export default VELODROME_DEFINITION;
