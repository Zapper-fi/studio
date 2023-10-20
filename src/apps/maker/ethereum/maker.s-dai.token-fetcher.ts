import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { MakerContractFactory, MakerSDai } from '../contracts';

@PositionTemplate()
export class EthereumMakerSDaiTokenFetcher extends AppTokenTemplatePositionFetcher<MakerSDai> {
  groupLabel = 'sDAI';

  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MakerContractFactory) protected readonly contractFactory: MakerContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MakerSDai {
    return this.contractFactory.makerSDai({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x83f20f44975d03b1b09e64809b757c47f942beea'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MakerSDai>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<MakerSDai>) {
    const ratioRaw = await contract.convertToAssets(BigNumber.from((1e18).toString()));
    const ratio = Number(ratioRaw) / 10 ** appToken.decimals;
    return [ratio];
  }
}
