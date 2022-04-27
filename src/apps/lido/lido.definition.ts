import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { ProtocolAction, GroupType, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LIDO_DEFINITION = {
  id: 'lido',
  name: 'Lido',
  description: 'Liquidity for staked assets',
  url: 'https://lido.fi/',
  links: {
    github: 'https://github.com/lidofinance',
    twitter: 'https://twitter.com/lidofinance',
    discord: 'https://discord.com/invite/lido',
    telegram: 'https://t.me/lidofinance',
    medium: 'https://lidofinance.medium.com/',
  },
  stethSymbol: 'stETH',
  wstethSymbol: 'wstETH',
  groups: {
    steth: { id: 'steth', type: GroupType.TOKEN },
    wsteth: { id: 'wsteth', type: GroupType.TOKEN },
  },
  tags: [ProtocolTag.DERIVATIVES],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
  stethAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  wstethAddress: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
};

@Register.AppDefinition(LIDO_DEFINITION.id)
export class LidoAppDefinition extends AppDefinition {
  constructor() {
    super(LIDO_DEFINITION);
  }
}

export default LIDO_DEFINITION;
