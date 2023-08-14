import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VelaVlpTokenFetcher } from '../common/vela.vlp.token-fetcher';

@PositionTemplate()
export class ArbitrumVelaVlpTokenFetcher extends VelaVlpTokenFetcher {
  vlpAddress = '0xc5b2d9fda8a82e8dcecd5e9e6e99b78a9188eb05';
  usdcAddress = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
  vaultAddress = '0xc4abade3a15064f9e3596943c699032748b13352';
}
