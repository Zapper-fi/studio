import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const UNISWAP_V2_DEFINITION: AppDefinitionObject = {
  id: 'uniswap-v2',
  name: 'Uniswap V2',
  description: `A protocol for trading and automated liquidity provision on Ethereum.`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN },
  },
  url: 'https://uniswap.org/',
  links: {
    github: 'https://github.com/Uniswap',
    twitter: 'https://twitter.com/Uniswap',
    discord: 'https://discord.gg/FCfyBSbCU5',
  },
  tags: [ProtocolTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#f80076',
  token: {
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    network: Network.ETHEREUM_MAINNET,
  },
};

@Register.AppDefinition(UNISWAP_V2_DEFINITION.id)
export class UniswapV2AppDefinition extends AppDefinition {
  constructor() {
    super(UNISWAP_V2_DEFINITION);
  }
}
