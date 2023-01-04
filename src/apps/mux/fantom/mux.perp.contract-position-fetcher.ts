import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MuxPerpContractPositionFetcher } from '../common/mux.perp.contract-position-fetcher';

@PositionTemplate()
export class FantomMuxPerpContractPositionFetcher extends MuxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  readerAddress = '0x2981bb8f9c7f7c5b9d8ca5e41c0d9cbbd89c7489';
  usdcAddress = '0x04068da6c83afcfa0e13ba15a6696662335d5b75';
  vaultAddress = '0xdaf2064f52f123ee1d410e97c2df549c23a99683';
}
