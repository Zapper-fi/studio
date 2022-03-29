import { ArrayMinSize, IsEnum, IsString } from 'class-validator';

import { Network } from '~types/network.interface';

export class GetAppBalancesQuery {
  @IsEnum(Network)
  network: Network = Network.ETHEREUM_MAINNET;

  @IsString({ each: true })
  @ArrayMinSize(1)
  addresses: string[];
}
