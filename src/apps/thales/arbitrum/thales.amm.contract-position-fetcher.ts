import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesAmmContractPositionFetcher } from '../common/thales.amm.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumThalesAmmContractPositionFetcher extends ThalesAmmContractPositionFetcher {
  ammDefinitions = [
    { address: '0x8e9018b48456202aa9bb3e485192b8475822b874', name: 'Overtime AMM' },
    { address: '0xea4c2343fd3c239c23dd37dd3ee51aec84544735', name: 'Thales AMM' },
  ];
}
