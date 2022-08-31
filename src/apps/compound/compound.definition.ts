import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const COMPOUND_DEFINITION = appDefinition({
  id: 'compound',
  name: 'Compound',
  description: `An algorithmic, autonomous interest rate protocol built for developers`,
  groups: {
    supply: { id: 'supply', type: GroupType.TOKEN, label: 'Lending' },
    borrow: { id: 'borrow', type: GroupType.POSITION, label: 'Lending' },
    claimable: { id: 'claimable', type: GroupType.POSITION, label: 'Claimable', isHiddenFromExplore: true },
  },
  presentationConfig: {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow'],
          },
        ],
      },
    ],
  },
  url: 'https://compound.finance/',
  links: {
    github: 'https://github.com/compound-finance/compound-protocol',
    twitter: 'https://twitter.com/compoundfinance',
    discord: 'https://discord.com/invite/fq6JSPkpJn',
    medium: 'https://medium.com/compound-finance',
  },
  tags: [AppTag.LENDING],
  supportedNetworks: { [Network.ETHEREUM_MAINNET]: [AppAction.VIEW] },
  primaryColor: '#00d395',
});

@Register.AppDefinition(COMPOUND_DEFINITION.id)
export class CompoundAppDefinition extends AppDefinition {
  constructor() {
    super(COMPOUND_DEFINITION);
  }
}
