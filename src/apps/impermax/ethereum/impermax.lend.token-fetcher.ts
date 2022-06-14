import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxLendTokenHelper } from '../helpers/impermax.lend.token-fetcher-helper';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.lend.id;
const network = Network.ETHEREUM_MAINNET;

export const address = '0x8c3736e2fe63cc2cd89ee228d9dbcab6ce5b767b';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumImpermaxLendTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(ImpermaxLendTokenHelper) private readonly impermaxLendTokenHelper: ImpermaxLendTokenHelper) {}

  async getPositions() {
    return this.impermaxLendTokenHelper.getPositions({ address, network });
  }
}
