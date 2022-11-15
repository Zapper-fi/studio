import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const B_PROTOCOL_DEFINITION = appDefinition({
  id: 'b-protocol',
  name: 'B.Protocol',
  description: `B.Protocol is a backstop protocol which BPRO holders govern. Users of the protocol have access to all the benefits of MakerDAO and Compound (soon Aave), with the additional benefit of splitting liquidation proceeds according to proportional usage of the protocol.`,
  url: 'https://www.bprotocol.org/',
  tags: [AppTag.LENDING],

  links: {
    twitter: 'https://twitter.com/bprotocoleth',
    discord: 'https://discord.com/invite/bJ4guuw',
    medium: 'https://medium.com/b-protocol',
    github: 'https://github.com/backstop-protocol',
  },

  groups: {
    compoundSupply: {
      id: 'compound-supply',
      type: GroupType.TOKEN,
      label: 'Compound Supply',
    },

    compoundBorrow: {
      id: 'compound-borrow',
      type: GroupType.POSITION,
      label: 'Compound Supply',
    },

    liquityStabilityPool: {
      id: 'liquity-stability-pool',
      type: GroupType.POSITION,
      label: 'Liquity Stability Pool',
    },

    makerVault: {
      id: 'maker-vault',
      type: GroupType.POSITION,
      label: 'Maker Vaults',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(B_PROTOCOL_DEFINITION.id)
export class BProtocolAppDefinition extends AppDefinition {
  constructor() {
    super(B_PROTOCOL_DEFINITION);
  }
}
