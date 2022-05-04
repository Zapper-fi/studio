import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTvlParams {
  @ApiProperty()
  @IsString()
  appId: string;
}
