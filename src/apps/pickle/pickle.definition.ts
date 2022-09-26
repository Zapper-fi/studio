import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PICKLE_DEFINITION = appDefinition({
  id: 'pickle',
  name: 'Pickle',
  description: `Pickle Finance helps users to maximize their DeFi yields by auto-compounding their rewards, saving them time and gas.`,
  url: 'https://pickle.finance/',
  links: {
    github: 'https://github.com/pickle-finance',
    twitter: 'https://twitter.com/picklefinance',
    discord: 'https://t.co/vbEtaWx8j6',
    telegram: 'https://t.me/picklefinance',
    medium: 'https://picklefinance.medium.com/',
  },
  groups: {
    jar: { id: 'jar', type: GroupType.TOKEN, label: 'Jars' },
    votingEscrow: { id: 'voting-escrow', type: GroupType.POSITION, label: 'Dill' },
    masterchefFarm: { id: 'masterchef-farm', type: GroupType.POSITION, label: 'Farms' },
    masterchefV2Farm: { id: 'masterchef-v2-farm', type: GroupType.POSITION, label: 'Farms' },
    singleStakingFarm: { id: 'single-staking-farm', type: GroupType.POSITION, label: 'Farms' },
  },
  primaryColor: '#1b8d54',
  tags: [AppTag.YIELD_AGGREGATOR],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
    [Network.MOONRIVER_MAINNET]: [AppAction.VIEW],
  },
  token: {
    address: '0x429881672b9ae42b8eba0e26cd9c73711b891ca5',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(PICKLE_DEFINITION.id)
export class PickleAppDefinition extends AppDefinition {
  constructor() {
    super(PICKLE_DEFINITION);
  }
}
