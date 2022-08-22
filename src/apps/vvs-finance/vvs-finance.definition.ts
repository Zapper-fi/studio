import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const VVS_FINANCE_DEFINITION = appDefinition({
  id: 'vvs-finance',
  name: 'VVS Finance',
  description: 'Very, Very Simple DeFi',
  url: 'https://vvs.finance/',

  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Farm' },
    farmV2: { id: 'farm-v2', type: GroupType.POSITION, label: 'Farm V2' },
    autoVvsMine: { id: 'auto-vvs-mine', type: GroupType.POSITION, label: 'Auto VVS Mine' },
    mine: { id: 'mine', type: GroupType.POSITION, label: 'Mine' },
    xvvs: { id: 'xvvs', type: GroupType.TOKEN, label: 'xVVS' },
    xvvsVault: { id: 'xvvs-vault', type: GroupType.TOKEN, label: 'xVVS Vault' },
  },

  tags: [AppTag.DECENTRALIZED_EXCHANGE, AppTag.FARMING, AppTag.LIQUIDITY_POOL, AppTag.LIQUID_STAKING],

  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(VVS_FINANCE_DEFINITION.id)
export class VvsFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(VVS_FINANCE_DEFINITION);
  }
}

export default VVS_FINANCE_DEFINITION;
