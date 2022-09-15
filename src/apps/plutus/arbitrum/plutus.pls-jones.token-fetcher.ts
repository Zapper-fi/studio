import { Injectable } from '@nestjs/common';

import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

import PLUTUS_DEFINITION from '../plutus.definition';

@Injectable()
export class ArbitrumPlutusPlsJonesTokenFetcher extends WrapperTemplateTokenFetcher {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.plsJones.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'plsJONES';

  vaultAddress = '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44';
  underlyingTokenAddress = '0xe8ee01ae5959d3231506fcdef2d5f3e85987a39c';
}
