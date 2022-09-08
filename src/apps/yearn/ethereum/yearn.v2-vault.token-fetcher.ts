import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { YearnV2VaultTokenFetcher } from '../common/yearn.v2-vault.token-fetcher';
import { YEARN_DEFINITION } from '../yearn.definition';

@Injectable()
export class EthereumYearnV2VaultTokenFetcher extends YearnV2VaultTokenFetcher {
  appId = YEARN_DEFINITION.id;
  groupId = YEARN_DEFINITION.groups.v2Vault.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Vaults';
  vaultsToIgnore = ['0xc5bddf9843308380375a611c18b50fb9341f502a'];
}
