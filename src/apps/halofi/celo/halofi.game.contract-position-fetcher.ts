import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { HalofiGameContractPositionFetcher } from '../common/halofi.game.contract-position-fetcher';

@PositionTemplate()
export class CeloHalofiGameContractPositionFetcher extends HalofiGameContractPositionFetcher {
  groupLabel = 'Games';
}
