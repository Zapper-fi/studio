import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HECTOR_DAO_DEFINITION = appDefinition({
  id: 'hector-dao',
  name: 'Hector Network',
  description: `Hector Network is developing an expansive web 3 ecosystem for a visionary future. The foundations of the ecosystem, supported by the HEC utility token and TOR stablecoin, are functionality, accessibility and community. In conjunction with their growing list of partners, Hector Network is expanding crosschain and is dedicated to mass adoption.`,
  url: 'https://hector.network/',
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
