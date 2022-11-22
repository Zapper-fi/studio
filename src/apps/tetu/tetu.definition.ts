import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const TETU_DEFINITION = appDefinition({
  id: 'tetu',
  name: 'Tetu',
  description: `Tetu is a Web3 asset management protocol built on Polygon that implements automated yield farming strategies to provide investors with a safe and secure method of receiving a high and stable yield on their investments`,
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN, label: 'Pools' },
    yield: { id: 'yield', type: GroupType.TOKEN, label: 'Yield' },
  },
  url: 'https://app.tetu.io/',
  links: {
    discord: 'https://discord.com/invite/xs8VESN4yz',
    github: 'https://github.com/tetu-io',
    twitter: 'https://twitter.com/tetu_io',
  },
  tags: [AppTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(TETU_DEFINITION.id)
export class TetuAppDefinition extends AppDefinition {
  constructor() {
    super(TETU_DEFINITION);
  }
}

export default TETU_DEFINITION;
