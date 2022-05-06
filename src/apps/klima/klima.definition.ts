import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KLIMA_DEFINITION = appDefinition({
  id: 'klima',
  name: 'Klima',
  description: `As a matter of course, Klima DAO will solve the critical problems of the carbon markets: illiquidity, opacity and inefficiency.`,
  groups: {
    bond: { id: 'bond', type: GroupType.POSITION },
    sKlima: { id: 'sKlima', type: GroupType.TOKEN },
    wsKlima: { id: 'wsKlima', type: GroupType.TOKEN },
  },
  url: 'https://www.klimadao.finance/',
  links: {
    github: 'https://github.com/KlimaDAO',
    twitter: 'https://twitter.com/KlimaDAO',
    discord: 'https://discord.com/invite/klimadao',
    telegram: 'https://t.me/joinchat/Zb06f_mnMosyYTYy',
    medium: 'https://klimadao.medium.com',
    learn: 'https://docs.klimadao.finance',
  },
  tags: [AppTag.ELASTIC_FINANCE],
  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
  token: {
    address: '0x4e78011ce80ee02d2c3e649fb657e45898257815', // KLIMA
    network: Network.POLYGON_MAINNET,
  },
});

@Register.AppDefinition(KLIMA_DEFINITION.id)
export class KlimaAppDefinition extends AppDefinition {
  constructor() {
    super(KLIMA_DEFINITION);
  }
}
