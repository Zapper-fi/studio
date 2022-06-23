import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ABRACADABRA_DEFINITION = appDefinition({
  id: 'abracadabra',
  groups: {
    stakedSpell: { id: 'staked-spell', type: GroupType.TOKEN, label: 'Staked SPELL' },
    mSpell: { id: 'm-spell', type: GroupType.POSITION, label: 'mSpell' },
    cauldron: { id: 'cauldron', type: GroupType.POSITION, label: 'Cauldrons' },
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Farms' },
    degenbox: { id: 'degenbox', type: GroupType.POSITION, label: 'Abracadabra Degenbox' },
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
  tags: [AppTag.LENDING],
  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(ABRACADABRA_DEFINITION.id)
export class AbracadabraAppDefinition extends AppDefinition {
  constructor() {
    super(ABRACADABRA_DEFINITION);
  }
}
