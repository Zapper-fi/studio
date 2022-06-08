import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PIE_DAO_DEFINITION = appDefinition({
  id: 'pie-dao',
  name: 'PieDAO',
  description: `PieDAO is the asset allocation DAO for decentralized market-weighted portfolio allocations.`,
  groups: {
    farmSingleStaking: { id: 'farm-single-staking', type: GroupType.POSITION, label: 'Farming', groupLabel: 'Farms' },
    farmMasterChef: { id: 'farm-master-chef', type: GroupType.POSITION, label: 'Farming', groupLabel: 'Farms' },
    eDough: { id: 'e-dough', type: GroupType.TOKEN, label: 'Escrow' },
    voting: { id: 'voting', type: GroupType.POSITION, label: 'Voting Escrow' },
  },
  url: 'https://www.piedao.org/',
  links: {
    github: 'https://github.com/pie-dao',
    twitter: 'https://twitter.com/PieDAO_DeFi',
    discord: 'https://discord.com/invite/eJTYNUF',
    telegram: 'https://t.me/piedao',
    medium: 'https://medium.com/piedao',
  },
  tags: [AppTag.ASSET_MANAGEMENT],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(PIE_DAO_DEFINITION.id)
export class PieDaoAppDefinition extends AppDefinition {
  constructor() {
    super(PIE_DAO_DEFINITION);
  }
}
