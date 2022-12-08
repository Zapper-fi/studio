import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const EXACTLY_DEFINITION = appDefinition({
  id: 'exactly',
  name: 'Exactly Protocol',
  description:
    'Exactly is a decentralized, non-custodial and open-source protocol that provides an autonomous fixed and variable interest rate market enabling users to frictionlessly exchange the time value of their assets and completing the DeFi credit market.',
  url: 'https://app.exact.ly',
  tags: [AppTag.LENDING],

  groups: {
    deposit: {
      id: 'deposit',
      type: GroupType.TOKEN,
      label: 'Variable Deposit',
    },
    borrow: {
      id: 'borrow',
      type: GroupType.TOKEN,
      label: 'Variable Borrow',
    },
  },
  presentationConfig: {
    tabs: [
      {
        label: 'Markets',
        viewType: 'split',
        views: [
          {
            viewType: 'split',
            label: 'Deposit',
            views: [{ viewType: 'list', label: 'Variable', groupIds: ['deposit'] }],
          },
          {
            viewType: 'split',
            label: 'Borrow',
            views: [{ viewType: 'list', label: 'Variable', groupIds: ['borrow'] }],
          },
        ],
      },
    ],
  },

  links: {
    discord: 'https://exact.ly/discord',
    github: 'https://github.com/exactly-protocol',
    medium: 'https://medium.com/@exactly_protocol',
    twitter: 'https://twitter.com/exactlyprotocol',
    telegram: 'https://t.me/exactlyFinance',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#000',
});

@Register.AppDefinition(EXACTLY_DEFINITION.id)
export class ExactlyAppDefinition extends AppDefinition {
  constructor() {
    super(EXACTLY_DEFINITION);
  }
}
