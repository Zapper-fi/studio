import { IsEnum } from 'class-validator';

import { Network } from '~types/network.interface';

export class GetTvlQuery {
  @IsEnum(Network)
  network: Network = Network.ETHEREUM_MAINNET;
}
