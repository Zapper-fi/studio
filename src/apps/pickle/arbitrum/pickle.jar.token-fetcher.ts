import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PickleJarTokenFetcher } from '../common/pickle.jar.token-fetcher';

@PositionTemplate()
export class ArbitrumPickleJarTokenFetcher extends PickleJarTokenFetcher {
  groupLabel = 'Jars';
}
