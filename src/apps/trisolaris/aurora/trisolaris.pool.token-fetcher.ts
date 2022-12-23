import { Register } from '~app-toolkit/decorators';
import { UniswapV2DefaultPoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.pool.on-chain.template.token-fetcher';
import { Network } from '~types/network.interface';

import TRISOLARIS_DEFINITION from '../trisolaris.definition';

const appId = TRISOLARIS_DEFINITION.id;
const groupId = TRISOLARIS_DEFINITION.groups.pool.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraTrisolarisPoolTokenFetcher extends UniswapV2DefaultPoolOnChainTemplateTokenFetcher {
  factoryAddress = '0xc66f594268041db60507f00703b152492fb176e7';
  groupLabel = 'Pools';
}
