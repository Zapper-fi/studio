import { ApiProperty } from '@nestjs/swagger';

export class GetBalancesParams {
  @ApiProperty({ description: 'ID of the application' })
  appId: string;
}
