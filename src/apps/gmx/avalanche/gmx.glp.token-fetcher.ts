import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { GmxGlpTokenFetcher } from '../common/gmx.glp.token-fetcher';
import { GMX_DEFINITION } from '../gmx.definition';

@Injectable()
export class AvalancheGmxGlpTokenFetcher extends GmxGlpTokenFetcher {
  appId = GMX_DEFINITION.id;
  groupId = GMX_DEFINITION.groups.glp.id;
  network = Network.AVALANCHE_MAINNET;

  glmManagerAddress = '0xe1ae4d4b06a5fe1fc288f6b4cd72f9f8323b107f';
  glpTokenAddress = '0x01234181085565ed162a948b6a5e88758cd7c7b8';
  blockedTokenAddresses = ['0x130966628846bfd36ff31a822705796e8cb8c18d'];
  groupLabel = 'GLP';
}
