import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsEnum, IsString } from 'class-validator';

import { Network } from '~types/network.interface';

export class GetBalancesQuery {
  @ApiProperty({
    enum: Network,
  })
  @IsEnum(Network)
  network: Network = Network.ETHEREUM_MAINNET;

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  addresses: string[];
}
