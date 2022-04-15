import { IsString } from 'class-validator';

export class GetTvlParams {
  @IsString()
  appId: string;
}
