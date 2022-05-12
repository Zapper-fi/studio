import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsEnum, IsString } from 'class-validator';

import { Network } from '~types/network.interface';

export class GetBalancesQuery {
  @ApiProperty({ description: 'Network for which to retrieve balances', enum: Network, required: false })
  @IsEnum(Network)
  network: Network = Network.ETHEREUM_MAINNET;

  @ApiProperty({ description: 'Addresses for which to retrieve balances', type: [String], name: 'addresses[]' })
  @IsString({ each: true })
  @ArrayMinSize(1)
  addresses: string[];
}
