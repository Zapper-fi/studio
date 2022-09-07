import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';
import { AelinContractFactory } from '../contracts';

@Injectable()
export class OptimismAelinVAelinTokenFetcher extends VaultTokenFetcher {
  appId = AELIN_DEFINITION.id;
  groupId = AELIN_DEFINITION.groups.vAelin.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'vAELIN';

  vaultAddress = '0x780f70882ff4929d1a658a4e8ec8d4316b24748a';
  underlyingTokenAddress = '0x61baadcf22d2565b0f471b291c475db5555e0b76';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AelinContractFactory) protected readonly aelinContractFactory: AelinContractFactory,
  ) {
    super(appToolkit);
  }

  async getPricePerShare() {
    return 1;
  }

  async getDataProps({ appToken }) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity, reserve: 0 };
  }
}
