import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxLendTokenHelper } from '../helpers/impermax.lend.token-fetcher-helper';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.lend.id;
const network = Network.POLYGON_MAINNET;
export const address = '0xBB92270716C8c424849F17cCc12F4F24AD4064D6'.toLowerCase();

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonImpermaxLendTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(ImpermaxLendTokenHelper) private readonly impermaxLendTokenHelper: ImpermaxLendTokenHelper) {}

  async getPositions() {
    return this.impermaxLendTokenHelper.getPositions({ address, network });
  }
}
