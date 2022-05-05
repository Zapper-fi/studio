import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { Network } from '~types/network.interface';

export class GetPositionsQuery {
  @ApiProperty({ description: 'Retrieve positions for this network.', enum: Network })
  @IsEnum(Network)
  network: Network = Network.ETHEREUM_MAINNET;

  @ApiProperty({ description: 'Retrieve specific position group within the app.', isArray: true, name: `groupIds[]` })
  @IsString({ each: true })
  groupIds: string[];
}
