import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KINESIS_LABS_DEFINITION = appDefinition({
  id: 'kinesis-labs',
  name: 'Kinesis Labs',
  description:
    'Kinesis Labs is the native stableswap on Evmos that is designed to become the stablecoin hub for all of Cosmos through low slippage and a unique multi-bridge base pool system.',
  url: 'https://app.kinesislabs.co/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
  },

  tags: [AppTag.LIQUIDITY_POOL, AppTag.DECENTRALIZED_EXCHANGE],
  keywords: [],

  links: {
    twitter: 'https://twitter.com/KinesisLabs',
    telegram: 'https://t.me/KinesisLabsPublic',
    discord: 'https://discord.com/invite/2RQtMZeGEF',
    medium: 'https://kinesislabs.medium.com/',
  },

  supportedNetworks: {
    [Network.EVMOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(KINESIS_LABS_DEFINITION.id)
export class KinesisLabsAppDefinition extends AppDefinition {
  constructor() {
    super(KINESIS_LABS_DEFINITION);
  }
}

export default KINESIS_LABS_DEFINITION;
