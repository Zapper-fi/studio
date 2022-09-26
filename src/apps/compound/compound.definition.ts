import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppTag, GroupType } from '~app/app.interface';

export const COMPOUND_DEFINITION = appDefinition({
  id: 'compound',
  name: 'Compound',
  description: `An algorithmic, autonomous interest rate protocol built for developers`,
  url: 'https://compound.finance/',
  groups: {
    supply: { id: 'supply', type: GroupType.TOKEN, label: 'Lending', groupLabel: 'Supply' },
    borrow: { id: 'borrow', type: GroupType.POSITION, label: 'Lending', groupLabel: 'Borrow' },
    claimable: { id: 'claimable', type: GroupType.POSITION, label: 'Claimable' },
  },
  links: {
    github: 'https://github.com/compound-finance/compound-protocol',
    twitter: 'https://twitter.com/compoundfinance',
    discord: 'https://discord.com/invite/fq6JSPkpJn',
    medium: 'https://medium.com/compound-finance',
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
