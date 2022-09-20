import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ETHEREUM_DEFINITION = appDefinition({
  id: 'ethereum',
  name: 'Ethereum Staking',
  description: `Ethereum is open access to digital money and data-friendly services for everyone – no matter your background or location. It's a community-built technology behind the cryptocurrency ether (ETH) and thousands of applications you can use today.`,
  groups: {
    genesisDeposit: {
      id: 'genesis-deposit',
      type: GroupType.POSITION,
      label: 'Genesis Deposits',
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

@Register.AppDefinition(ETHEREUM_DEFINITION.id)
export class EthereumAppDefinition extends AppDefinition {
  constructor() {
    super(ETHEREUM_DEFINITION);
  }
}

export default ETHEREUM_DEFINITION;
