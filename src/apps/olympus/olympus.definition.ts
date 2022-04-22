import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const OLYMPUS_DEFINITION = {
  id: 'olympus',
  name: 'olympus',
  description:
    '" a community-owned, decentralized and censorship-resistant reserve currency that is deeply liquid, asset-backed, and used widely across Web3."',
  url: 'https://app.olympusdao.finance',
  groups: {
    bonds: { id: 'bonds', type: GroupType.POSITION },
  },
  tags: [],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
};

@Register.AppDefinition(OLYMPUS_DEFINITION.id)
export class OlympusAppDefinition extends AppDefinition {
  constructor() {
    super(OLYMPUS_DEFINITION);
  }
}

export default OLYMPUS_DEFINITION;
