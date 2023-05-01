import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { READER_ADDRESS, USDC_ADDRESS, VAULT_ADDRESS } from '~apps/mux/common/constants';
import { Network } from '~types';

import { MuxPerpContractPositionFetcher } from '../common/mux.perp.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainMuxPerpContractPositionFetcher extends MuxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  readerAddress = READER_ADDRESS[Network.BINANCE_SMART_CHAIN_MAINNET];
  usdcAddress = USDC_ADDRESS[Network.BINANCE_SMART_CHAIN_MAINNET];
  vaultAddress = VAULT_ADDRESS[Network.BINANCE_SMART_CHAIN_MAINNET];
}
