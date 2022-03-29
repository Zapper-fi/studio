import { Inject, Injectable } from '@nestjs/common';

import { TokenBalanceHelper } from './helpers/balance/token-balance.helper';

export const AppToolkitHelpers = [TokenBalanceHelper];

@Injectable()
export class AppToolkitHelperRegistry {
  constructor(@Inject(TokenBalanceHelper) public readonly tokenBalanceHelper: TokenBalanceHelper) {}
}
