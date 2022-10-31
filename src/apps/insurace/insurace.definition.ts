import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const INSURACE_DEFINITION = appDefinition({
  id: 'insurace',
  name: 'InsurAce',
  description:
    'InsurAce is a leading decentralized multi-chain protocol that provides reliable, robust and secure risk protection services to DeFi users, allowing them to protect their investment funds against various risks.',
  url: 'https://insurace.io/',
  groups: {
    mining: {
      id: 'mining',
      type: GroupType.TOKEN,
      label: 'Mining Pools',
    },
  },
  tags: [AppTag.INSURANCE],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/InsurAce_io',
    discord: 'https://discord.gg/vCZMjuH69F',
    telegram: 'https://t.me/insurace_protocol',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#1DB371',
  token: {
    address: '0x544c42fbb96b39b21df61cf322b5edc285ee7429',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(INSURACE_DEFINITION.id)
export class InsuraceAppDefinition extends AppDefinition {
  constructor() {
    super(INSURACE_DEFINITION);
  }
}

export default INSURACE_DEFINITION;
