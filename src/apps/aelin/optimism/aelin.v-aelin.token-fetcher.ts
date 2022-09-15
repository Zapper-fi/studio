import { Injectable } from '@nestjs/common';

import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';

@Injectable()
export class OptimismAelinVAelinTokenFetcher extends WrapperTemplateTokenFetcher {
  appId = AELIN_DEFINITION.id;
  groupId = AELIN_DEFINITION.groups.vAelin.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'vAELIN';

  vaultAddress = '0x780f70882ff4929d1a658a4e8ec8d4316b24748a';
  underlyingTokenAddress = '0x61baadcf22d2565b0f471b291c475db5555e0b76';
}
