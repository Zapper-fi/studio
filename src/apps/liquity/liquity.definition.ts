import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LIQUITY_DEFINITION = appDefinition({
  id: 'liquity',
  name: 'Liquity',
  description:
    'Liquity is a decentralized borrowing protocol that allows you to draw interest-free loans against Ether used as collateral.',
  url: 'https://www.liquity.org/',
  links: {
    github: 'https://github.com/liquity',
    twitter: 'https://twitter.com/LiquityProtocol',
    discord: 'https://t.co/0iKGcr4kyK',
    telegram: 'https://t.me/liquityprotocol',
    medium: 'https://medium.com/liquity',
  },
  groups: {
    staking: { id: 'staking', type: GroupType.POSITION, label: 'Staked' },
    trove: { id: 'trove', type: GroupType.POSITION, label: 'Trove' },
    stabilityPool: { id: 'stability-pool', type: GroupType.POSITION, label: 'Stability Pool' },
  },
  tags: [AppTag.COLLATERALIZED_DEBT_POSITION],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#fff',
  token: {
    address: '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(LIQUITY_DEFINITION.id)
export class LiquityAppDefinition extends AppDefinition {
  constructor() {
    super(LIQUITY_DEFINITION);
  }
}

export default LIQUITY_DEFINITION;
