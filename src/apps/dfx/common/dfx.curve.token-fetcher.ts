import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { DfxViemContractFactory } from '../contracts';
import { DfxCurve } from '../contracts/viem';

export abstract class DfxCurveTokenFetcher extends AppTokenTemplatePositionFetcher<DfxCurve> {
  abstract poolAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DfxViemContractFactory) protected readonly contractFactory: DfxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.dfxCurve({ network: this.network, address });
  }

  async getAddresses() {
    return this.poolAddresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<DfxCurve>) {
    return [
      { address: await contract.read.numeraires([BigInt(0)]), network: this.network },
      { address: await contract.read.numeraires([BigInt(1)]), network: this.network },
    ];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<DfxCurve>) {
    const liquidity = await contract.read.liquidity();
    const reserves = liquidity[1].map(reserveRaw => Number(reserveRaw) / 10 ** 18); // DFX report all token liquidity in 10**18

    return reserves.map(r => r / appToken.supply);
  }

  async getLabel({ appToken }: GetDisplayPropsParams<DfxCurve>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }
}
