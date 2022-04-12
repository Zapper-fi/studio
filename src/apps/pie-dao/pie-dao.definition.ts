import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PIE_DAO_DEFINITION = {
  id: 'pie-dao',
  name: 'PieDAO',
  description: `PieDAO is the asset allocation DAO for decentralized market-weighted portfolio allocations.`,
  groups: {
    farmSingleStaking: { id: 'farm-single-staking', type: GroupType.POSITION },
    farmMasterChef: { id: 'farm-master-chef', type: GroupType.POSITION },
    eDough: { id: 'e-dough', type: GroupType.TOKEN },
    voting: { id: 'voting', type: GroupType.POSITION },
  },
  url: 'https://www.piedao.org/',
  tags: [ProtocolTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
};

@Register.AppDefinition(PIE_DAO_DEFINITION.id)
export class PieDaoAppDefinition extends AppDefinition {
  constructor() {
    super(PIE_DAO_DEFINITION);
  }
}
