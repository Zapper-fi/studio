import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import { LemmaFinanceViemContractFactory } from '../contracts';
import { LemmaUsdl } from '../contracts/viem';

@PositionTemplate()
export class OptimismLemmaFinanceUsdlTokenFetcher extends AppTokenTemplatePositionFetcher<LemmaUsdl> {
  groupLabel = 'USDL';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LemmaFinanceViemContractFactory) protected readonly contractFactory: LemmaFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.lemmaUsdl({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x96f2539d3684dbde8b3242a51a73b66360a5b541'];
  }

  async getUnderlyingTokenDefinitions() {
    return [
      '0x4200000000000000000000000000000000000006', // WETH
      '0x68f180fcce6836688e9084f035309e29bf0a2095', // WBTC
      '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6', // LINK
      '0x0994206dfe8de6ec6920ff4d779b0d950605fb53', // CRV
      '0x9e1028f5f1d5ede59748ffcee5532509976840e0', // PERP
      '0x76fb31fb4af56892a25e32cfc43de717950c9278', // AAVE
    ].map(address => ({ address, network: this.network }));
  }

  async getPricePerShare() {
    return [1, 1, 1, 1, 1, 1]; // @TODO Get reserves to derive PPS
  }

  async getPrice() {
    return 1;
  }

  async getImages({ appToken }: GetDisplayPropsParams<LemmaUsdl>) {
    return [getAppAssetImage(appToken.appId, appToken.address)];
  }
}
