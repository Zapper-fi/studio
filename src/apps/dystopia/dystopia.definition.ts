import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const DYSTOPIA_DEFINITION = appDefinition({
  id: 'dystopia',
  name: 'Dystopia',
  description:
    'Dystopia is a decentralized exchange and automated market marker focused on providing efficient token swaps and deep liquidity for stablecoins and other assets.',
  url: 'https://www.dystopia.exchange/',

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

    votingEscrow: {
      id: 'voting-escrow',
      type: GroupType.POSITION,
      label: 'Voting Escrow',
    },
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(DYSTOPIA_DEFINITION.id)
export class DystopiaAppDefinition extends AppDefinition {
  constructor() {
    super(DYSTOPIA_DEFINITION);
  }
}

export default DYSTOPIA_DEFINITION;
