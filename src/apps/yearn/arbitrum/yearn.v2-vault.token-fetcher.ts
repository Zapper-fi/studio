import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { YearnV2VaultTokenFetcher } from '../common/yearn.v2-vault.token-fetcher';
import { YEARN_DEFINITION } from '../yearn.definition';

@Injectable()
export class ArbitrumYearnV2VaultTokenFetcher extends YearnV2VaultTokenFetcher {
  appId = YEARN_DEFINITION.id;
  groupId = YEARN_DEFINITION.groups.v2Vault.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Vaults';
  vaultsToIgnore = [];
}
