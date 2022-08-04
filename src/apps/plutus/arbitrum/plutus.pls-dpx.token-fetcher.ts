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
export class ArbitrumPlutusPlsDpxTokenFetcher extends AppTokenTemplatePositionFetcher {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.plsJones.id;
  network = Network.ARBITRUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly plutusContractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    return ['0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55'];
  }
}
