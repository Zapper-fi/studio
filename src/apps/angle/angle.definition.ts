import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ANGLE_DEFINITION = appDefinition({
  id: 'angle',
  name: 'Angle Protocol',
  description:
    'Angle is an over-collateralized, decentralized and capital-efficient stablecoin protocol. It is based on two smart contract modules. Angle Core module allows to mint agEUR from any token at face value, open perpetuals on collateral/stablecoin pairs, or deposit tokens to earn yield. Angle Borrowing module allows to borrow or get leverage with agEUR from tokens deposited as collateral. Angle is governed by veANGLE holders.',
  url: 'https://www.angle.money/',
  tags: [AppTag.STABLECOIN, AppTag.COLLATERALIZED_DEBT_POSITION, AppTag.CROSS_CHAIN, AppTag.PAYMENTS],
  keywords: ['stablecoin'],

  links: {
    github: 'https://github.com/AngleProtocol/',
    twitter: 'https://twitter.com/AngleProtocol',
    discord: 'https://discord.gg/5Af6xum9bc',
    telegram: 'https://t.me/AngleAnnouncements',
    medium: 'https://blog.angle.money/',
  },

  token: {
    address: '0x31429d1856ad1377a8a0079410b297e1a9e214c2',
    network: Network.ETHEREUM_MAINNET,
  },

  groups: {
    sanToken: {
      id: 'san-token',
      type: GroupType.TOKEN,
      label: 'Yield Bearing',
    },

    votingEscrow: {
      id: 'voting-escrow',
      type: GroupType.POSITION,
      label: 'Voting Escrow',
    },

    perpetual: {
      id: 'perpetual',
      type: GroupType.POSITION,
      label: 'Perpetuals',
    },

    vault: {
      id: 'vault',
      type: GroupType.POSITION,
      label: 'Vaults',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(ANGLE_DEFINITION.id)
export class AngleAppDefinition extends AppDefinition {
  constructor() {
    super(ANGLE_DEFINITION);
  }
}
