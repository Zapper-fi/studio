import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MM_FINANCE_DEFINITION = appDefinition({
  id: 'mm-finance',
  name: 'MMFinance',
  description: `MM.Finance - The largest ecosystem on Cronos with its DEX, Yield Optimizer, NFT, Algo Stablecoin & DTF`,
  url: 'https://mm.finance/',
  tags: [AppTag.LIQUIDITY_POOL],
  links: {
    twitter: 'https://twitter.com/mmfinance',
    discord: 'https://discord.gg/mmfinance',
    telegram: 'https://t.me/mmfinance',
    medium: 'https://mmfinance.medium.com/',
  },
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    farmV2: { id: 'farm-v2', type: GroupType.POSITION, label: 'Farms' },
    syrupStaking: { id: 'syrup-staking', type: GroupType.POSITION, label: 'Syrup Pools' },
    syrupMmf: { id: 'syrup-mmf', type: GroupType.POSITION, label: 'Syrup Pools' },
    autoMmf: { id: 'auto-mmf', type: GroupType.POSITION, label: 'Auto MMF', isHiddenFromExplore: true }, // This is the old staking mmf staking contract, and the rewards are being counted towards the TVL
    ifoMmf: { id: 'ifo-mmf', type: GroupType.POSITION, label: 'IFO Mmf', isHiddenFromExplore: true },
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Legacy Farms', isHiddenFromExplore: true },
  },
  supportedNetworks: { [Network.CRONOS_MAINNET]: [AppAction.VIEW] },
  primaryColor: '#cda16f',
  token: {
    address: '0x97749c9b61f878a880dfe312d2594ae07aed7656',
    network: Network.CRONOS_MAINNET,
  },
});

@Register.AppDefinition(MM_FINANCE_DEFINITION.id)
export class MmFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(MM_FINANCE_DEFINITION);
  }
}
