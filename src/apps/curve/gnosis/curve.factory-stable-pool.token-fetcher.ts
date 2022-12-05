import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolTokenFetcher } from '../common/curve.factory-stable-pool.token-fetcher';

@PositionTemplate()
export class GnosisCurveFactoryStablePoolTokenFetcher extends CurveFactoryStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0xd19baeadc667cf2015e395f2b08668ef120f41f5';
}
