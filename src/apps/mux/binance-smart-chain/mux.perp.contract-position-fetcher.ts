import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MuxPerpContractPositionFetcher } from '../common/mux.perp.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainMuxPerpContractPositionFetcher extends MuxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  readerAddress = '0x2981bb8f9c7f7c5b9d8ca5e41c0d9cbbd89c7489';
  usdcAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
  vaultAddress = '0x8d751570ba1fd8a8ae89e4b27d18bf6c321aab0a';
}
