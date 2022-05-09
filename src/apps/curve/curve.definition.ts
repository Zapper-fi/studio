import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CURVE_DEFINITION = appDefinition({
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
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Staking' },
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    votingEscrow: { id: 'votingEscrow', type: GroupType.POSITION, label: 'Voting Escrow' },
    vestingEscrow: { id: 'vestingEscrow', type: GroupType.POSITION, label: 'Vesting' },
  },
  tags: [AppTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
    [Network.HARMONY_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#34649c',
  token: {
    address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(CURVE_DEFINITION.id)
export class CurveAppDefinition extends AppDefinition {
  constructor() {
    super(CURVE_DEFINITION);
  }
}
