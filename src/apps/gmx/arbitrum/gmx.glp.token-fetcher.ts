import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { GmxGlpTokenFetcher } from '../common/gmx.glp.token-fetcher';
import { GMX_DEFINITION } from '../gmx.definition';
@Injectable()
export class ArbitrumGmxGlpTokenFetcher extends GmxGlpTokenFetcher {
  appId = GMX_DEFINITION.id;
  groupId = GMX_DEFINITION.groups.glp.id;
  network = Network.ARBITRUM_MAINNET;

  glmManagerAddress = '0x321f653eed006ad1c29d174e17d96351bde22649';
  glpTokenAddress = '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258';
  blockedTokenAddresses = ['0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a'];
  groupLabel = 'GLP';
}
