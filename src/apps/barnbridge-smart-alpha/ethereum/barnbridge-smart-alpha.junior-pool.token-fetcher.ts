import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import BARNBRIDGE_SMART_ALPHA_DEFINITION from '../barnbridge-smart-alpha.definition';
import { BarnbridgeSmartAlphaJuniorPoolTokenFetcher } from '../common/barnbridge-smart-alpha.junior.pool-token-fetcher';

@Injectable()
export class EthereumBarnbridgeSmartAlphaJuniorTokenFetcher extends BarnbridgeSmartAlphaJuniorPoolTokenFetcher {
  appId = BARNBRIDGE_SMART_ALPHA_DEFINITION.id;
  groupId = BARNBRIDGE_SMART_ALPHA_DEFINITION.groups.juniorPool.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Junior pools';
  minLiquidity = 0;
  poolAlphaAddresses = [
    '0x31f7da25361ad99ca4daa4e8709624660f324f48',
    '0x13d5387389ac1a3b72391d88b03b893a945b17cd',
    '0xb0105f829d50841b949c274636c2d173a78db7e0',
    '0x0b2bcde6a404c53c05a6c0f5402daed4f2dd5779',
    '0x21f768446a171f50a20c727e420981ad70e0e9d9',
    '0xeca0ffc5e3566e9dad05f206f2ca1ff0174af476',
    '0x6acb5f6d4c7e2ca6fe3b7cac13ca6b3ea6c9ee01',
  ];
}
