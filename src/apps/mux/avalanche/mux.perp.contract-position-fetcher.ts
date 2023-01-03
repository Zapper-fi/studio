import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MuxPerpContractPositionFetcher } from '../common/mux.perp.contract-position-fetcher';

@PositionTemplate()
export class AvalancheMuxPerpContractPositionFetcher extends MuxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  readerAddress = '0xb33e3ddce77b7679fa92af77863ae439c44c8519';
  usdcAddress = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e';
  vaultAddress = '0x29a28cc3fdc128693ef6a596ef45c43ff63b7062';
}
