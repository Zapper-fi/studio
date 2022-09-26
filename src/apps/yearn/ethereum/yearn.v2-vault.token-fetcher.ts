import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YearnV2VaultTokenFetcher } from '../common/yearn.v2-vault.token-fetcher';

@PositionTemplate()
export class EthereumYearnV2VaultTokenFetcher extends YearnV2VaultTokenFetcher {
  groupLabel = 'Vaults';
  vaultsToIgnore = ['0xc5bddf9843308380375a611c18b50fb9341f502a'];
}
