import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { GmxPerpContractPositionFetcher } from '../common/gmx.perp.contract-position-fetcher';
import { GMX_DEFINITION } from '../gmx.definition';

const appId = GMX_DEFINITION.id;
const groupId = GMX_DEFINITION.groups.perp.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumGmxPerpContractPositionFetcher extends GmxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  vaultAddress = '0x489ee077994b6658eafa855c308275ead8097c4a';
  usdcAddress = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
}
