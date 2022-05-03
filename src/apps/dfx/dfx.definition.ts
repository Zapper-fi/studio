import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const DFX_DEFINITION = {
  id: 'dfx',
  name: 'dfx',
  description: 'DFX.Finance is a decentralized foreign exchange protocol optimized for stablecoins',
  url: 'https://app.dfx.finance/',
  groups: {
    dfxCurve: { id: 'dfx-curve', type: GroupType.TOKEN },
    staking: { id: 'staking', type: GroupType.POSITION },
  },
  tags: [],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(DFX_DEFINITION.id)
export class DfxAppDefinition extends AppDefinition {
  constructor() {
    super(DFX_DEFINITION);
  }
}

export default DFX_DEFINITION;
