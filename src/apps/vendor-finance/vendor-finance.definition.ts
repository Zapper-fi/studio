import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const VENDOR_FINANCE_DEFINITION = appDefinition({
  id: 'vendor-finance',
  name: 'Vendor Finance',
  description:
    'Vendor Finance allows for permission-less, isolated, fixed-rate, fixed-term, and zero liquidation loan markets to be created. Lenders create fully customizable loans by setting all their own terms ! Borrowers obtain non-liquidatable, fixed rate, and fixed terms loans.',
  url: 'https://vendor.finance/borrow',
  tags: [AppTag.LENDING],
  keywords: [],

  links: {
    discord: 'https://discord.com/invite/mZWtWVJvzZ',
    github: 'https://github.com/VendorFinance',
    medium: 'https://vendorfinance.medium.com/',
    twitter: 'https://twitter.com/VendorFi',
  },

  groups: {
    pools: {
      id: 'pools',
      type: GroupType.POSITION,
      label: 'Lending pools',
    },
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(VENDOR_FINANCE_DEFINITION.id)
export class VendorFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(VENDOR_FINANCE_DEFINITION);
  }
}
