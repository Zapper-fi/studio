import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV5PrizeVaultTokenFetcher } from '../common/pool-together-v5.prize-vault.token-fetcher';

@PositionTemplate()
export class OptimismPoolTogetherV5PrizeVaultTokenFetcher extends PoolTogetherV5PrizeVaultTokenFetcher {
  groupLabel = 'Prize Vaults';
}
