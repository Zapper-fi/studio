import { Injectable } from '@nestjs/common';

import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

import PLUTUS_DEFINITION from '../plutus.definition';

@Injectable()
export class ArbitrumPlutusPlsDpxTokenFetcher extends WrapperTemplateTokenFetcher {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.plsDpx.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'plsDPX';

  vaultAddress = '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1';
  underlyingTokenAddress = '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55';
}
