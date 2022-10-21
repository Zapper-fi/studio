import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PickleJarTokenFetcher } from '../common/pickle.jar.token-fetcher';

@PositionTemplate()
export class MoonriverPickleJarTokenFetcher extends PickleJarTokenFetcher {
  groupLabel = 'Jars';
}
