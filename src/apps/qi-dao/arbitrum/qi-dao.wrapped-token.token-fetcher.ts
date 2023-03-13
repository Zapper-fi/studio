import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { WrappedTokenTokenFetcher } from '../common/qi-dao.wrapped-token.token-fetcher';

@PositionTemplate()
export class ArbitrumWrappedTokenTokenFetcher extends WrappedTokenTokenFetcher {
  async getAddresses(): Promise<string[]> {
    return ['0x4fc050d75dba5bf2d6ebd3667ffec731a45b1f35'];
  }
}
