import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { FARMS } from '~apps/curve/ethereum/curve.farm.contract-position-fetcher';
import { Network } from '~types/network.interface';

export const SADDLE_DEFINITION = appDefinition({
  id: 'saddle',
  name: 'Saddle',
  description: `Saddle is an automated market maker optimized for trading between pegged value crypto assets.`,
  url: 'https://saddle.finance/',
  links: {
    github: 'https://github.com/saddle-finance',
    twitter: 'https://twitter.com/saddlefinance',
    discord: 'https://discord.com/invite/saddle',
  },
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pool' },
    minichefV2: { id: 'minichefV2', type: GroupType.POSITION, label: 'MiniChefv2' },
    communalFarms: { id: 'communal-farms', type: GroupType.POSITION, label: 'CommunalFarms'},
    masterchefFarm: { id: 'masterchef-farm', type: GroupType.POSITION, label: 'Farms' },
  },
  primaryColor: '#fff',
  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.EVMOS_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },
  token: {
  address: '0xf1dc500fde233a4055e25e5bbf516372bc4f6871',
  network: Network.ETHEREUM_MAINNET,
},
});

@Register.AppDefinition(SADDLE_DEFINITION.id)
export class SaddleAppDefinition extends AppDefinition {
  constructor() {
    super(SADDLE_DEFINITION);
  }
}

export default SADDLE_DEFINITION;
