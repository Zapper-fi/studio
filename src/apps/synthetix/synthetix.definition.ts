import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SYNTHETIX_DEFINITION = appDefinition({
  id: 'synthetix',
  name: 'Synthetix',
  description: `A new financial primitive enabling the creation of synthetic assets, offering unique derivatives and exposure to real-world assets on the blockchain.`,
  groups: {
    synth: { id: 'synth', type: GroupType.TOKEN },
    farm: { id: 'farm', type: GroupType.POSITION },
    mintr: { id: 'mintr', type: GroupType.POSITION },
  },
  url: 'https://synthetix.io/',
  links: {
    github: 'https://github.com/Synthetixio/synthetix',
    twitter: 'https://twitter.com/synthetix_io',
    discord: 'https://discord.com/invite/AEdUHzt',
    telegram: 'https://t.me/s/havven_news',
  },
  tags: [ProtocolTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW, ProtocolAction.STAKE, ProtocolAction.TRANSACT],
    [Network.OPTIMISM_MAINNET]: [ProtocolAction.VIEW, ProtocolAction.STAKE],
  },
});

@Register.AppDefinition(SYNTHETIX_DEFINITION.id)
export class SynthetixAppDefinition extends AppDefinition {
  constructor() {
    super(SYNTHETIX_DEFINITION);
  }
}
