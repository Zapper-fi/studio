import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { PendleLiquidityMiningContractPositionFetcher } from '../common/pendle.liquidity-mining.contract-position-fetcher';
import { PENDLE_DEFINITION } from '../pendle.definition';

const appId = PENDLE_DEFINITION.id;
const groupId = PENDLE_DEFINITION.groups.liquidityMining.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalanchePendleLiquidityMiningContractPositionFetcher extends PendleLiquidityMiningContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Liquidity Mining';

  pendleDataAddress = '0x94d7e5c48ca9627001facb04d1820c54dff3032c';
  liquidityMiningAddresses = [
    '0x2489a32844556193fb296c22597bdc158e9762a0', // YT-qiUSDC / USDC
    '0x47a3e9d5c87651d4074ef67a160afdb3f42cb242', // YT-qiAVAX / USDC
    '0x204e698a71bb1973823517c74be041a985eaa46e', // YT-PA / PENDLE
    '0xa3e0ca7e35f47f6547c0c2d8f005312c2188e70f', // YT-xJOE / USDC
    '0x9ada5ce16cdbd76afdd28b891cd0a1a9f659dad6', // YT-WMEMO / MIM
    // '0x224d395e9e123bc9c37bff8bcd845562d5232713', // OT-qiUSDC / USDC
    // '0xfe60eec35e3c4aad1e69f10957ad0a7d3cfc6cea', // OT-qiAVAX / USDC
    // '0xb3c6772f341ad234fa41f8c4f981cf4489dfa6e9', // OT-PA / PENDLE
    // '0xd0788af7a613b81f437a51b96594a6387c7329b1', // OT-xJOE / USDC
    // '0x2aa0bec34deeb6987c118ce353d14eea6def24ce', // OT-WMEMO / MIM
  ];
}
