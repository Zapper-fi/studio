import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ETHEREUM_STAKING_DEFINITION = appDefinition({
  id: 'ethereum-staking',
  name: 'Ethereum Staking',
  description: `Staking is a public good for the Ethereum ecosystem. Any user with any amount of ETH can help secure the network and earn rewards in the process.`,
  groups: {
    deposit: {
      id: 'deposit',
      type: GroupType.POSITION,
      label: 'Deposits',
    },
  },
  url: 'https://ethereum.org/',
  links: {
    github: 'https://github.com/ethereum',
    twitter: 'https://twitter.com/ethereum',
  },
  tags: [AppTag.INFRASTRUCTURE],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(ETHEREUM_STAKING_DEFINITION.id)
export class EthereumStakingAppDefinition extends AppDefinition {
  constructor() {
    super(ETHEREUM_STAKING_DEFINITION);
  }
}

export default ETHEREUM_STAKING_DEFINITION;
