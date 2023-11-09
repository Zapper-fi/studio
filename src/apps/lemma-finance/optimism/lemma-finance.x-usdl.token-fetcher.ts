import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { LemmaFinanceContractFactory, LemmaXUsdl } from '../contracts';

@PositionTemplate()
export class OptimismLemmaFinanceXUsdlTokenFetcher extends AppTokenTemplatePositionFetcher<LemmaXUsdl> {
  groupLabel = 'xUSDL';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LemmaFinanceViemContractFactory) protected readonly contractFactory: LemmaFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LemmaXUsdl {
    return this.contractFactory.lemmaXUsdl({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x252ea7e68a27390ce0d53851192839a39ab8b38c'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x96f2539d3684dbde8b3242a51a73b66360a5b541', network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<LemmaXUsdl>) {
    const pricePerShareRaw = await contract.assetsPerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;
    return [1 / pricePerShare];
  }
}
