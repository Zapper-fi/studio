import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PickleJarUniv3TokenFetcher } from '../common/pickle.jar-univ3.token-fetcher';

@PositionTemplate()
export class OptimismUniV3PickleJarTokenFetcher extends PickleJarUniv3TokenFetcher {
  groupLabel = 'UniV3 Jars';
}
