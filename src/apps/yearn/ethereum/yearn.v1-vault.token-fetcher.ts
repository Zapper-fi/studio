import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { YearnV1VaultTokenFetcher } from '../common/yearn.v1-vault.token-fetcher';
import { YEARN_DEFINITION } from '../yearn.definition';

@Injectable()
export class EthereumYearnV1VaultTokenFetcher extends YearnV1VaultTokenFetcher {
  appId = YEARN_DEFINITION.id;
  groupId = YEARN_DEFINITION.groups.v1Vault.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'V1 Vaults';
  vaultsToIgnore = ['0xc5bddf9843308380375a611c18b50fb9341f502a'];
}
