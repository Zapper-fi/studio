import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HECTOR_DAO_DEFINITION = appDefinition({
  id: 'hector-dao',
  name: 'Hector DAO',
  description: `Hector Finance is developing a financial center on the Fantom Opera Chain and beyond, consisting of a variety of use cases supported by the $HEC token.`,
  url: 'https://hectordao.com/',
  tags: [AppTag.ELASTIC_FINANCE],
  groups: {
    vault: { id: 'vault', type: GroupType.TOKEN, label: 'Hector DAO', groupLabel: 'Farms' },
    bond: { id: 'bond', type: GroupType.POSITION, label: 'Bonds' },
    stakeBond: { id: 'stake-bond', type: GroupType.POSITION, label: 'Bonds' },
  },
  links: {
    twitter: 'https://twitter.com/Hector_Network',
    discord: 'https://discord.com/invite/hector',
    github: 'https://github.com/HectorNetwork',
    telegram: 'https://t.me/hector_network',
    medium: 'https://medium.com/@Hector_Network',
  },
  supportedNetworks: {
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(HECTOR_DAO_DEFINITION.id)
export class HectorDaoAppDefinition extends AppDefinition {
  constructor() {
    super(HECTOR_DAO_DEFINITION);
  }
}
