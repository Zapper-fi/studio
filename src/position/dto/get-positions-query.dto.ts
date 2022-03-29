import { IsEnum, IsString } from 'class-validator';

import { Network } from '~types/network.interface';

export class GetPositionsQuery {
  @IsEnum(Network)
  network: Network = Network.ETHEREUM_MAINNET;

  @IsString({ each: true })
  groupIds: string[];
}
