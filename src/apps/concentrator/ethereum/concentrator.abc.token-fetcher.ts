import { Inject } from '@nestjs/common';
import axios, { Axios } from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetPriceParams, GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

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
    return ['0xDEC800C2b17c9673570FDF54450dc1bd79c8E359'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AbcCvx>) {
    return [
      { address: await contract.curveLpToken(), network: this.network },
      { address: await contract.debtToken(), network: this.network },
    ];
  }

  async getPricePerShare({ } : GetPricePerShareParams<AbcCvx> )  {
    return [1]; 
  }

  async getPrice({ }: GetPriceParams<AbcCvx>): Promise<number> {
    return await axios.get('https://api.aladdin.club/api/aladdin/initInfo').then(v => v.data.data.abcCVXPrice)
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AbcCvx>) {
    return appToken.supply * appToken.price;
  }

}
