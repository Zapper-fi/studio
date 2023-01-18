import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PickleJarTokenFetcher } from '../common/pickle.jar.token-fetcher';

@PositionTemplate()
export class CronosPickleJarTokenFetcher extends PickleJarTokenFetcher {
  groupLabel = 'Jars';
}
