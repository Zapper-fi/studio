import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BLUEBIT_DEFINITION = appDefinition({
  id: 'bluebit',
  name: 'BlueBit Finance',
  description:
    'BlueBit Finance is a yield aggregator built on Near’s Aurora EVM. The protocol allows users to earn more yield from DeFi farming in a more secure, accessible, and efficient manner.',
  url: 'https://bluebit.fi',
  groups: {
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
    votingEscrow: {
      id: 'voting-escrow',
      type: GroupType.POSITION,
      label: 'Voting Escrow',
    },
  },
  tags: [AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {
    github: 'https://github.com/BluebitFinance/bluebit-core',
    twitter: 'https://twitter.com/BlueBitFinance',
    discord: 'https://discord.gg/9jd6q3Gv7f',
    medium: 'https://bluebitfinance.medium.com/',
  },
  token: {
    address: '0x4148d2ce7816f0ae378d98b40eb3a7211e1fcf0d',
    network: Network.AURORA_MAINNET,
  },

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#409eff',
});

@Register.AppDefinition(BLUEBIT_DEFINITION.id)
export class BluebitAppDefinition extends AppDefinition {
  constructor() {
    super(BLUEBIT_DEFINITION);
  }
}

export default BLUEBIT_DEFINITION;
