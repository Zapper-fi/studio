import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesVaultContractPositionFetcher } from '../common/thales.vault.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumThalesVaultContractPositionFetcher extends ThalesVaultContractPositionFetcher {
  vaultDefinitions = [
    { address: '0x0a29cddbdaaf56342507574820864dac967d2683', name: 'Thales Discount' },
    { address: '0x640c34d9595ad5351da8c5c833bbd1afd20519ea', name: 'Thales Degen Discount' },
    { address: '0x008a4e30a8b41781f5cb017b197aa9aa4cd53b46', name: 'Thales Safu Discount' },
    { address: '0xff7aea98740fa1e2a9eb81680583e62aaff1e3ad', name: 'Overtime Discount' },
    { address: '0xa852a651377fbe23f3d3acf5919c3d092ad4b77d', name: 'Overtime Degen Discount' },
    { address: '0xe26374c7afe71a2a6ab4a61080772547c43b87e6', name: 'Overtime Safu Discount' },
    { address: '0xab9e5fc491c743ae0b45f7100faf611deb8fec4a', name: 'Overtime Parlay Discount' },
    { address: '0x31c2947c86412a5e33794105aa034dd9312eb711', name: 'Overtime Upsettoor' },
  ];
}
