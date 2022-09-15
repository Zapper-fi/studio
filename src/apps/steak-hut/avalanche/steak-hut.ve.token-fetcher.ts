import { Injectable } from '@nestjs/common';

import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

@Injectable()
export class AvalancheSteakHutVeTokenFetcher extends WrapperTemplateTokenFetcher {
  appId = STEAK_HUT_DEFINITION.id;
  groupId = STEAK_HUT_DEFINITION.groups.ve.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Voting Escrow';

  vaultAddress = '0xe7250b05bd8dee615ecc681eda1196add5156f2b';
  underlyingTokenAddress = '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd';
}
