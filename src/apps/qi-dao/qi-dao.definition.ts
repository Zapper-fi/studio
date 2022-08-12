import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const QI_DAO_DEFINITION = appDefinition({
  id: 'qi-dao',
  name: 'Qi Dao',
  description: `Qi Dao is a lending and stablecoin protocol native to Polygon.`,
  groups: {
    escrowedQi: { id: 'escrowed-qi', type: GroupType.POSITION, label: 'Escrowed QI' },
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Staking' },
    anchorVault: { id: 'anchor-vault', type: GroupType.POSITION, label: 'Anchor Vaults' },
    vault: { id: 'vault', type: GroupType.POSITION, label: 'Vaults' },
    yield: { id: 'yield', type: GroupType.TOKEN, label: 'Yield' },
  },
  url: 'https://www.mai.finance/',
  tags: [AppTag.COLLATERALIZED_DEBT_POSITION, AppTag.FARMING, AppTag.STABLECOIN],
  links: {
    github: 'https://github.com/qi-dao-mai-finance',
    twitter: 'https://twitter.com/QiDaoProtocol',
    discord: 'https://discord.gg/mQq55j65xJ',
    telegram: 'https://t.me/QiDaoProtocol',
    medium: 'https://0xlaozi.medium.com/',
  },
  supportedNetworks: {
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(QI_DAO_DEFINITION.id)
export class QiDaoAppDefinition extends AppDefinition {
  constructor() {
    super(QI_DAO_DEFINITION);
  }
}
