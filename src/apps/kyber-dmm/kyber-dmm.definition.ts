import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KYBER_DMM_DEFINITION = appDefinition({
  id: 'kyber-dmm',
  name: 'Kyber DMM',
  description: `KyberDMM is a next-generation AMM designed to maximize the use of capital by enabling extremely high capital efficiency and reacting to market conditions to optimise returns for liquidity providers.`,
  url: 'https://dmm.exchange/',
  tags: [AppTag.LIQUIDITY_POOL],
  links: {},

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Kyber DMM',
      groupLabel: 'Pools',
    },

    legacyFarm: {
      id: 'legacy-farm',
      type: GroupType.POSITION,
      label: 'Kyber DMM',
      groupLabel: 'Farms',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Kyber DMM',
      groupLabel: 'Farms',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(KYBER_DMM_DEFINITION.id)
export class KyberDmmAppDefinition extends AppDefinition {
  constructor() {
    super(KYBER_DMM_DEFINITION);
  }
}
