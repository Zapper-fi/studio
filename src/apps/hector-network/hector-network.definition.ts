import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HECTOR_NETWORK_DEFINITION = appDefinition({
  id: 'hector-network',
  name: 'Hector Network',
  description: `Hector Network is developing an expansive web 3 ecosystem for a visionary future. The foundations of the ecosystem, supported by the HEC utility token and TOR stablecoin, are functionality, accessibility and community. In conjunction with their growing list of partners, Hector Network is expanding crosschain and is dedicated to mass adoption.`,
  url: 'https://hector.network/',
  tags: [AppTag.ELASTIC_FINANCE],
  groups: {
    sHecV1: {
      id: 's-hec-v1',
      type: GroupType.TOKEN,
      label: 'Staked HEC V1',
    },

    sHecV2: {
      id: 's-hec-v2',
      type: GroupType.TOKEN,
      label: 'Staked HEC V2',
    },

    wsHec: {
      id: 'ws-hec',
      type: GroupType.TOKEN,
      label: 'Wrapped sHEC V2',
    },

    hec: {
      id: 'hec',
      type: GroupType.TOKEN,
      label: 'Hector Network',
    },

    bond: {
      id: 'bond',
      type: GroupType.POSITION,
      label: 'Bonds',
    },

    stakeBond: {
      id: 'stake-bond',
      type: GroupType.POSITION,
      label: 'Bonds',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
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
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(HECTOR_NETWORK_DEFINITION.id)
export class HectorNetworkAppDefinition extends AppDefinition {
  constructor() {
    super(HECTOR_NETWORK_DEFINITION);
  }
}
