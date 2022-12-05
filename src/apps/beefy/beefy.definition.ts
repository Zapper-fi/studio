import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BEEFY_DEFINITION = appDefinition({
  id: 'beefy',
  name: 'Beefy Finance',
  description: `Beefy Finance is a Decentralized Finance (DeFi) Yield Optimizer platform that allows its users to earn compound interest on their holdings.`,
  url: 'https://app.beefy.finance/',
  tags: [AppTag.YIELD_AGGREGATOR],
  groups: {
    vault: { id: 'vault', type: GroupType.TOKEN, label: 'Vault' },
    boostVault: { id: 'boost-vault', type: GroupType.POSITION, label: 'Boost Vault' },
  },
  links: {
    github: 'https://github.com/beefyfinance',
    twitter: 'https://twitter.com/beefyfinance',
    discord: 'https://discord.com/invite/yq8wfHd',
    telegram: 'https://t.me/beefyfinance',
  },
  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(BEEFY_DEFINITION.id)
export class BeefyAppDefinition extends AppDefinition {
  constructor() {
    super(BEEFY_DEFINITION);
  }
}
