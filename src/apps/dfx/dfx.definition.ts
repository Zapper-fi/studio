import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const DFX_DEFINITION = appDefinition({
  id: 'dfx',
  name: 'DFX',
  description: 'DFX.Finance is a decentralized foreign exchange protocol optimized for stablecoins',
  url: 'https://exchange.dfx.finance/',
  links: {
    github: 'https://github.com/dfx-finance',
    twitter: 'https://twitter.com/DFXFinance',
    discord: 'http://discord.dfx.finance/',
    telegram: 'https://t.me/DFX_Finance',
    medium: 'https://medium.com/dfxfinance',
  },
  groups: {
    curve: {
      id: 'curve',
      type: GroupType.TOKEN,
      label: 'DFX Curves',
    },

    staking: {
      id: 'staking',
      type: GroupType.POSITION,
      label: 'DFX Staking',
    },
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.LIQUIDITY_POOL, AppTag.STABLECOIN],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#fff',
});

@Register.AppDefinition(DFX_DEFINITION.id)
export class DfxAppDefinition extends AppDefinition {
  constructor() {
    super(DFX_DEFINITION);
  }
}

export default DFX_DEFINITION;
