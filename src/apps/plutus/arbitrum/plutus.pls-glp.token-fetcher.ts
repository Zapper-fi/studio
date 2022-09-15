import { Injectable } from '@nestjs/common';

import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

import PLUTUS_DEFINITION from '../plutus.definition';

@Injectable()
export class ArbitrumPlutusPlsGlpTokenFetcher extends WrapperTemplateTokenFetcher {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.plsGlp.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'plsGLP';

  vaultAddress = '0x530f1cbb2ebd71bec58d351dcd3768148986a467';
  underlyingTokenAddress = '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258';
}
