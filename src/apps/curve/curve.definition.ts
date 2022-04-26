import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CURVE_DEFINITION: AppDefinitionObject = {
  id: 'curve',
  name: 'Curve',
  description: `An exchange liquidity pool on Ethereum designed for: extremely efficient stablecoin trading, low risk, supplemental fee income for liquidity providers`,
  url: 'https://curve.fi',
  links: {
    github: 'https://github.com/curvefi/',
    twitter: 'https://twitter.com/curvefinance',
    discord: 'https://discord.com/invite/rgrfS7W',
    telegram: 'https://t.me/curvefi',
  },
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
    pool: { id: 'pool', type: GroupType.TOKEN },
    votingEscrow: { id: 'votingEscrow', type: GroupType.POSITION },
    vestingEscrow: { id: 'vestingEscrow', type: GroupType.POSITION },
  },
  tags: [ProtocolTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [ProtocolAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [ProtocolAction.VIEW],
    [Network.GNOSIS_MAINNET]: [ProtocolAction.VIEW],
    [Network.HARMONY_MAINNET]: [ProtocolAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [ProtocolAction.VIEW],
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#34649c',
  token: {
    address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    network: Network.ETHEREUM_MAINNET,
  },
};

@Register.AppDefinition(CURVE_DEFINITION.id)
export class CurveAppDefinition extends AppDefinition {
  constructor() {
    super(CURVE_DEFINITION);
  }
}
