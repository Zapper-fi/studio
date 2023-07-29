import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VelaEsVelaTokenFetcher } from '../common/vela.es-vela.token-fetcher';

@PositionTemplate()
export class ArbitrumVelaEsVelaTokenFetcher extends VelaEsVelaTokenFetcher {
  esVelaAddress = '0xefd5a713c5bd85e9ced46070b2532e4a47a18102';
  velaAddress = '0x088cd8f5ef3652623c22d48b1605dcfe860cd704';
}
