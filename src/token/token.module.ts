import { Module } from '@nestjs/common';

import { TokenService } from './token.service';

@Module({
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
