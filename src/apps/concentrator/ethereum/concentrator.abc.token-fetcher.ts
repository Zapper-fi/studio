import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AbcCvx, ConcentratorContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorAbcCvxTokenFetcher extends AppTokenTemplatePositionFetcher<AbcCvx> {
  groupLabel = 'abcCVX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AbcCvx {
    return this.contractFactory.abcCvx({ address, network: this.network });
  }

  getAddresses() {
    return ['0xdec800c2b17c9673570fdf54450dc1bd79c8e359'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AbcCvx>) {
    return [
      { address: await contract.curveLpToken(), network: this.network },
      { address: await contract.debtToken(), network: this.network },
    ];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<AbcCvx>) {
    const supply = await contract.totalSupply();
    const reserves = await Promise.all([contract.totalCurveLpToken(), contract.totalDebtToken()]);
    return reserves.map(r => Number(r) / Number(supply));
  }
}
