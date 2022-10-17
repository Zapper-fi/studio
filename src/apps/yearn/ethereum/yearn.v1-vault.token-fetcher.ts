import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YearnV1VaultTokenFetcher } from '../common/yearn.v1-vault.token-fetcher';

@PositionTemplate()
export class EthereumYearnV1VaultTokenFetcher extends YearnV1VaultTokenFetcher {
  groupLabel = 'V1 Vaults';
  vaultsToIgnore = ['0xc5bddf9843308380375a611c18b50fb9341f502a'];
}
