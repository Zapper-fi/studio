import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ABRACADABRA_DEFINITION: AppDefinitionObject = {
  id: 'abracadabra',
  groups: {
    stakedSpell: { id: 'staked-spell', type: GroupType.TOKEN },
    cauldron: { id: 'cauldron', type: GroupType.POSITION },
    farm: { id: 'farm', type: GroupType.POSITION },
  },
  name: 'Abracadabra',
  description: `Abracadabra is a lending platform that uses interest-bearing tokens as collateral to borrow a USD pegged stable coin that can be used as any other stablecoin. Abracadabra provides the opportunity for users to unlock the capital of their yield.`,
  url: 'https://abracadabra.money/',
  links: {
    github: 'https://github.com/Abracadabra-money',
    twitter: 'https://twitter.com/MIM_Spell',
    discord: 'https://t.co/mi8POGJUaH',
    telegram: 'https://t.me/abracadabramoney',
    medium: 'https://abracadabramoney.medium.com/',
  },
  tags: [ProtocolTag.LENDING],
  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [ProtocolAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [ProtocolAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [ProtocolAction.VIEW],
  },
};

@Register.AppDefinition(ABRACADABRA_DEFINITION.id)
export class AbracadabraAppDefinition extends AppDefinition {
  constructor() {
    super(ABRACADABRA_DEFINITION);
  }
}
