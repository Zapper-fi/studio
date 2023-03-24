import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VelaEsVelaTokenFetcher } from '../common/vela.es-vela.token-fetcher';

@PositionTemplate()
export class ArbitrumVelaEsVelaTokenFetcher extends VelaEsVelaTokenFetcher {
  esVelaAddress = '0xa9f5606c3e6aab998fd4f4bc54a18d9fe13a0dd8';
  velaAddress = '0x088cd8f5ef3652623c22d48b1605dcfe860cd704';
}
