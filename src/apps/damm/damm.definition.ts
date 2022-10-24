import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppTag, GroupType } from '~app/app.interface';

export const COMPOUND_DEFINITION = appDefinition({
  id: 'damm',
  name: 'Damm',
  description: `An algorithmic, autonomous interest rate protocol built for developers`,
  url: 'https://damm.finance/',
  groups: {
    supply: { id: 'supply', type: GroupType.TOKEN, label: 'Lending', groupLabel: 'Supply' },
    borrow: { id: 'borrow', type: GroupType.POSITION, label: 'Lending', groupLabel: 'Borrow' },
    claimable: { id: 'claimable', type: GroupType.POSITION, label: 'Claimable' },
  },
  links: {
    twitter: 'https://twitter.com/dammfinance',
    discord: 'https://discord.gg/zn8PkeTyGw',
    medium: 'https://medium.com/@dammfianance',
  },
  tags: [AppTag.LENDING],
  primaryColor: '#00d395',
});

@Register.AppDefinition(COMPOUND_DEFINITION.id)
export class CompoundAppDefinition extends AppDefinition {
  constructor() {
    super(COMPOUND_DEFINITION);
  }
}
