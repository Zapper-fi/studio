import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MuxPerpContractPositionFetcher } from '../common/mux.perp.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumMuxPerpContractPositionFetcher extends MuxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  readerAddress = '0x437cea956b415e97517020490205c07f4a845168';
  usdcAddress = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
  vaultAddress = '0x917952280770daa800e1b4912ea08450bf71d57e';
}
