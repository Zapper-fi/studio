import { Module } from '@nestjs/common';

import { PriceSelectorService } from './price-selector.service';
import { TokenApiClient } from './token-api.client';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService, TokenApiClient, PriceSelectorService],
  exports: [TokenService, PriceSelectorService],
})
export class TokenModule {}
