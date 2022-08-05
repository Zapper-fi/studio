import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { PlutusContractFactory } from '../contracts';
import PLUTUS_DEFINITION from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.plsJones.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusPlsJonesTokenFetcher extends AppTokenTemplatePositionFetcher {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.plsJones.id;
  network = Network.ARBITRUM_MAINNET;
  dependencies = [{ appId: 'sushiswap', groupIds: ['pool'], network }];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly plutusContractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    return ['0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0xe8ee01ae5959d3231506fcdef2d5f3e85987a39c'];
  }
}
