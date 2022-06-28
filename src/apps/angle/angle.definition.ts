import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ANGLE_DEFINITION = appDefinition({
  id: 'angle',
  name: 'angle',
  description:
    'Angle is an over-collateralized, decentralized and capital-efficient stablecoin protocol. It is based on two smart contract modules. Angle Core module allows to mint agEUR from any token at face value, open perpetuals on collateral/stablecoin pairs, or deposit tokens to earn yield. Angle Borrowing module allows to borrow or get leverage with agEUR from tokens deposited as collateral. Angle is governed by veANGLE holders.',
  url: 'https://www.angle.money/',

  links: {
    github: 'https://github.com/AngleProtocol/',
    twitter: 'https://twitter.com/AngleProtocol',
    discord: 'https://discord.gg/5Af6xum9bc',
    telegram: 'https://t.me/AngleAnnouncements',
    medium: 'https://blog.angle.money/',
    learn: 'https://blog.angle.money/',
  },

  tags: [AppTag.STABLECOIN, AppTag.COLLATERALIZED_DEBT_POSITION, AppTag.CROSS_CHAIN, AppTag.PAYMENTS],
  keywords: ['stablecoin'],

  token: {
    address: '0x31429d1856aD1377A8A0079410B297e1a9e214c2',
    network: Network.ETHEREUM_MAINNET,
  },

  groups: {
    angle: { id: 'angle', type: GroupType.TOKEN, label: 'Protocol token' },
    agtoken: { id: 'agtoken', type: GroupType.TOKEN, label: 'Stable token' },
    santoken: { id: 'santoken', type: GroupType.TOKEN, label: 'Yield bearing' },
    veangle: { id: 'veangle', type: GroupType.POSITION, label: 'Voting token / locked' },
    perpetuals: { id: 'perpetuals', type: GroupType.POSITION, label: 'Perpetual' },
    vaults: { id: 'vaults', type: GroupType.POSITION, label: 'Vault' },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ANGLE_DEFINITION.id)
export class AngleAppDefinition extends AppDefinition {
  constructor() {
    super(ANGLE_DEFINITION);
  }
}

export default ANGLE_DEFINITION;
