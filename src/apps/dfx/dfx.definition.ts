import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const DFX_DEFINITION = {
  id: 'dfx',
  name: 'dfx',
  description: 'DFX.Finance is a decentralized foreign exchange protocol optimized for stablecoins',
  url: 'https://app.dfx.finance/',
  links: {
    github: 'https://github.com/dfx-finance',
    twitter: 'https://twitter.com/DFXFinance',
    discord: 'http://discord.dfx.finance/',
    telegram: 'https://t.me/DFX_Finance',
    medium: 'https://medium.com/dfxfinance',
  },
  groups: {
    dfxCurve: { id: 'dfx-curve', type: GroupType.TOKEN },
    staking: { id: 'staking', type: GroupType.POSITION },
  },
  tags: [ProtocolTag.EXCHANGE, ProtocolTag.LIQUIDITY_POOL, ProtocolTag.STABLECOIN],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(DFX_DEFINITION.id)
export class DfxAppDefinition extends AppDefinition {
  constructor() {
    super(DFX_DEFINITION);
  }
}

export default DFX_DEFINITION;
