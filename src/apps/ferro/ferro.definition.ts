import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const FERRO_DEFINITION = appDefinition({
  id: 'ferro',
  name: 'Ferro',
  description: 'a stableswap AMM protocol on Cronos',
  url: 'https://ferroprotocol.com',
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    stakedLiquidity: { id: 'staked-liquidity', type: GroupType.POSITION, label: 'Staked Liquidity' },
    xfer: { id: 'xfer', type: GroupType.TOKEN, label: 'xFER' },
    xferVault: { id: 'xfer-vault', type: GroupType.POSITION, label: 'xFER Vault' },
  },
  tags: [AppTag.ALGORITHMIC_STABLECOIN, AppTag.DECENTRALIZED_EXCHANGE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(FERRO_DEFINITION.id)
export class FerroAppDefinition extends AppDefinition {
  constructor() {
    super(FERRO_DEFINITION);
  }
}

export default FERRO_DEFINITION;
