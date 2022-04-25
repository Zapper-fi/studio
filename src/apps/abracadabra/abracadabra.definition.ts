import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ABRACADABRA_DEFINITION = {
  id: 'abracadabra',
  groups: {
    stakedSpell: { id: 'staked-spell', type: GroupType.TOKEN },
    cauldron: { id: 'cauldron', type: GroupType.POSITION },
    farm: { id: 'farm', type: GroupType.POSITION },
  },
  name: 'Abracadabra',
  description: `Abracadabra is a lending platform that uses interest-bearing tokens as collateral to borrow a USD pegged stable coin that can be used as any other stablecoin. Abracadabra provides the opportunity for users to unlock the capital of their yield.`,
  url: 'https://abracadabra.money/',
  tags: [ProtocolTag.LENDING],
  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [ProtocolAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [ProtocolAction.VIEW],
  },
};

@Register.AppDefinition(ABRACADABRA_DEFINITION.id)
export class AbracadabraAppDefinition extends AppDefinition {
  constructor() {
    super(ABRACADABRA_DEFINITION);
  }
}
