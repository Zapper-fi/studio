import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { WrappedTokenTokenFetcher } from '../common/qi-dao.wrapped-token.token-fetcher';

@PositionTemplate()
export class PolygonWrappedTokenTokenFetcher extends WrappedTokenTokenFetcher {
  async getAddresses(): Promise<string[]> {
    return ['0x4c8dfb55d08bd030814cb6fe774420f3c01a5edb', '0x2dea91e68fdc5693b63924c5fee0a28cfb78a801'];
  }
}
