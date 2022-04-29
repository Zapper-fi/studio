import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const QI_DAO_DEFINITION: AppDefinitionObject = {
  id: 'qi-dao',
  name: 'Qi Dao',
  description: `Qi Dao is a lending and stablecoin protocol native to Polygon.`,
  groups: {
    escrowedQi: { id: 'escrowed-qi', type: GroupType.POSITION },
    farm: { id: 'farm', type: GroupType.POSITION },
    vault: { id: 'vault', type: GroupType.POSITION },
    yield: { id: 'yield', type: GroupType.TOKEN },
  },
  url: 'https://www.mai.finance/',
  tags: [ProtocolTag.LENDING],
  links: {
    github: 'https://github.com/qi-dao-mai-finance',
    twitter: 'https://twitter.com/QiDaoProtocol',
    discord: 'https://discord.gg/mQq55j65xJ',
    telegram: 'https://t.me/QiDaoProtocol',
    medium: 'https://0xlaozi.medium.com/',
  },
  supportedNetworks: {
    [Network.FANTOM_OPERA_MAINNET]: [ProtocolAction.VIEW],
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW],
  },
};

@Register.AppDefinition(QI_DAO_DEFINITION.id)
export class QiDaoAppDefinition extends AppDefinition {
  constructor() {
    super(QI_DAO_DEFINITION);
  }
}
