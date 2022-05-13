import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SYNTHETIX_DEFINITION = appDefinition({
  id: 'synthetix',
  name: 'Synthetix',
  description: `A new financial primitive enabling the creation of synthetic assets, offering unique derivatives and exposure to real-world assets on the blockchain.`,
  groups: {
    synth: { id: 'synth', type: GroupType.TOKEN, label: 'Synths' },
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Mintr' },
    mintr: { id: 'mintr', type: GroupType.POSITION, label: 'Staking' },
  },
  url: 'https://synthetix.io/',
  links: {
    github: 'https://github.com/Synthetixio/synthetix',
    twitter: 'https://twitter.com/synthetix_io',
    discord: 'https://discord.com/invite/AEdUHzt',
    telegram: 'https://t.me/s/havven_news',
  },
  tags: [AppTag.SYNTHETICS],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW, AppAction.STAKE, AppAction.TRANSACT],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW, AppAction.STAKE],
  },
});

@Register.AppDefinition(SYNTHETIX_DEFINITION.id)
export class SynthetixAppDefinition extends AppDefinition {
  constructor() {
    super(SYNTHETIX_DEFINITION);
  }
}
