import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { DfxContractFactory, DfxCurve } from '../contracts';

export abstract class DfxCurveTokenFetcher extends AppTokenTemplatePositionFetcher<DfxCurve> {
  abstract poolAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DfxContractFactory) protected readonly contractFactory: DfxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DfxCurve {
    return this.contractFactory.dfxCurve({ network: this.network, address });
  }

  async getAddresses() {
    return this.poolAddresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<DfxCurve>) {
    return [
      { address: await contract.numeraires(0), network: this.network },
      { address: await contract.numeraires(1), network: this.network },
    ];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<DfxCurve>) {
    const liquidity = await contract.liquidity();
    const reserves = liquidity.individual_.map(reserveRaw => Number(reserveRaw) / 10 ** 18); // DFX report all token liquidity in 10**18

    return reserves.map(r => r / appToken.supply);
  }

  async getLabel({ appToken }: GetDisplayPropsParams<DfxCurve>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }
}
