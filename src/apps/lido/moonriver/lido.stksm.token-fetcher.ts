import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { LidoContractFactory } from '../contracts';
import { LidoStksm } from '../contracts/ethers/LidoStksm';

@PositionTemplate()
export class MoonriverLidoStksmTokenFetcher extends AppTokenTemplatePositionFetcher<LidoStksm> {
  groupLabel = 'stKSM';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LidoContractFactory) protected readonly contractFactory: LidoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LidoStksm {
    return this.contractFactory.lidoStksm({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xffc7780c34b450d917d557e728f033033cb4fa8c'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x0000000000000000000000000000000000000000', network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<LidoStksm>) {
    const pricePerShareRaw = await contract.getPooledKSMByShares(new BigNumber(10).pow(18).toFixed(0));
    return [Number(pricePerShareRaw) / 10 ** 18];
  }
}
