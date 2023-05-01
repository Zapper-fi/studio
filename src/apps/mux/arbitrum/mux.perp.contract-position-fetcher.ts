import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { READER_ADDRESS, USDC_ADDRESS, VAULT_ADDRESS } from '~apps/mux/common/constants';
import { Network } from '~types';

import { MuxPerpContractPositionFetcher } from '../common/mux.perp.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumMuxPerpContractPositionFetcher extends MuxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  readerAddress = READER_ADDRESS[Network.ARBITRUM_MAINNET];
  usdcAddress = USDC_ADDRESS[Network.ARBITRUM_MAINNET];
  vaultAddress = VAULT_ADDRESS[Network.ARBITRUM_MAINNET];
}
