import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { WrappedTokenTokenFetcher } from '../common/qi-dao.wrapped-token.token-fetcher';

@PositionTemplate()
export class OptimismWrappedTokenTokenFetcher extends WrappedTokenTokenFetcher {
  async getAddresses(): Promise<string[]> {
    return ['0x22f39d6535df5767f8f57fee3b2f941410773ec4'];
  }
}
