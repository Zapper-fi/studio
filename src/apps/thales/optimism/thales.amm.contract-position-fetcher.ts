import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesAmmContractPositionFetcher } from '../common/thales.amm.contract-position-fetcher';

@PositionTemplate()
export class OptimismThalesAmmContractPositionFetcher extends ThalesAmmContractPositionFetcher {
  ammDefinitions = [
    { address: '0x842e89b7a7ef8ce099540b3613264c933ce0eba5', name: 'Overtime AMM' },
    { address: '0x2dc1fe64afa2281ff38df998be029e94c561937f', name: 'Overtime Parlay AMM' },
    { address: '0xc10a0a6ff6496e0bd896f9f6da5a7b640b85ea40', name: 'Thales AMM' },
  ];
}
