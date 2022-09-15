import { Injectable } from '@nestjs/common';

import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';

@Injectable()
export class FantomBeethovenXFBeetsTokenFetcher extends VaultTemplateTokenFetcher {
  appId = BEETHOVEN_X_DEFINITION.id;
  groupId = BEETHOVEN_X_DEFINITION.groups.fBeets.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Staking';

  vaultAddress = '0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1';
  underlyingTokenAddress = '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837';
}
