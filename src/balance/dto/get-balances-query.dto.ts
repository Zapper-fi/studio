import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsEnum, IsString } from 'class-validator';
import { uniq } from 'lodash';

import { Network } from '~types/network.interface';

export class GetBalancesQuery {
  @ApiProperty({ description: 'Network for which to retrieve balances', enum: Network, required: false })
  @IsEnum(Network)
  network: Network = Network.ETHEREUM_MAINNET;

  @ApiProperty({ description: 'Addresses for which to retrieve balances', type: [String], name: 'addresses[]' })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @Transform(({ value: addresses }: { value: string[] }) =>
    uniq((Array.isArray(addresses) ? addresses : []).slice(0, 15).map(address => address.toLowerCase())),
  )
  addresses: string[];
}
