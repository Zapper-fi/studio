import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VelaVlpTokenFetcher } from '../common/vela.vlp.token-fetcher';

@PositionTemplate()
export class ArbitrumVelaVlpTokenFetcher extends VelaVlpTokenFetcher {
  vlpAddress = '0x4e0d4a5a5b4faf5c2ecc1c63c8d19bb0804a96f1';
  usdcAddress = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
  velaVaultAddress = '0x5957582f020301a2f732ad17a69ab2d8b2741241';

  async getApy(): Promise<number> {
    return 0;
  }

  async getPricePerShare(): Promise<number[]> {
    return [0];
  }
}
