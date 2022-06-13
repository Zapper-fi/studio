import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const YEARN_DEFINITION = appDefinition({
  id: 'yearn',
  name: 'Yearn',
  description: `Automate your yield. DeFi made simple.`,
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Governance', isHiddenFromExplore: true },
    vault: { id: 'vault', type: GroupType.TOKEN, label: 'Vaults' },
    yield: { id: 'yield', type: GroupType.TOKEN, label: 'Yield Tokens', isHiddenFromExplore: true }, // We seem to have these twice e.g. the same yUSDT is here and in vaults
  },
  url: 'https://yearn.finance/',
  links: {
    github: 'https://github.com/yearn',
    twitter: 'https://twitter.com/iearnfinance',
    discord: 'https://discord.yearn.finance/',
    medium: 'https://medium.com/iearn',
  },
  tags: [AppTag.YIELD_AGGREGATOR],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#036eef',
  token: {
    address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(YEARN_DEFINITION.id)
export class YearnAppDefinition extends AppDefinition {
  constructor() {
    super(YEARN_DEFINITION);
  }
}
