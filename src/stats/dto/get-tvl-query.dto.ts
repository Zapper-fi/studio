import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { Network } from '~types/network.interface';

export class GetTvlQuery {
  @ApiProperty({
    enum: Network,
  })
  @IsEnum(Network)
  network: Network = Network.ETHEREUM_MAINNET;
}
