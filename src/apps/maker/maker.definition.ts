import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MAKER_DEFINITION = appDefinition({
  id: 'maker',
  name: 'Maker',
  description: `MakerDAO is a decentralized organization dedicated to bringing stability to the cryptocurrency economy.`,
  groups: {
    vault: { id: 'vault', type: GroupType.POSITION, label: 'Vaults' },
    governance: { id: 'governance', type: GroupType.POSITION, label: 'Governance', groupLabel: 'Farms' },
  },
  links: {
    github: 'https://github.com/makerdao',
    twitter: 'https://twitter.com/MakerDAO',
    discord: 'https://discord.com/invite/RBRumCpEDH',
    telegram: 'https://t.me/makerdaoofficial',
    medium: 'https://medium.com/@MakerDAO',
  },
  url: 'https://makerdao.com/en/',
  tags: [AppTag.COLLATERALIZED_DEBT_POSITION],
  supportedNetworks: { [Network.ETHEREUM_MAINNET]: [AppAction.VIEW] },
});

@Register.AppDefinition(MAKER_DEFINITION.id)
export class MakerAppDefinition extends AppDefinition {
  constructor() {
    super(MAKER_DEFINITION);
  }
}
