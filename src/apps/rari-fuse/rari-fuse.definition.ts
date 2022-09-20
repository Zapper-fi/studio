import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const RARI_FUSE_DEFINITION = appDefinition({
  id: 'rari-fuse',
  name: 'Rari Fuse',
  description: `Fuse is the first truly open interest rate protocol. Lend, borrow, and create isolated lending markets with unlimited flexibility.`,

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Lending',
    },
  },

  presentationConfig: {
    tabs: [
      {
        label: 'Markets',
        viewType: 'dropdown',
        options: [
          {
            label: '{{ dataProps.marketName }}',
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
    ],
  },

  url: 'https://rari.capital/',
  tags: [AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(RARI_FUSE_DEFINITION.id)
export class RariFuseAppDefinition extends AppDefinition {
  constructor() {
    super(RARI_FUSE_DEFINITION);
  }
}

export default RARI_FUSE_DEFINITION;
