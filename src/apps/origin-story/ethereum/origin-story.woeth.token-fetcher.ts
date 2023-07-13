import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { OriginStoryContractFactory, OriginStoryWoeth } from '../contracts';

@PositionTemplate()
export class EthereumOriginStoryWoethTokenFetcher extends AppTokenTemplatePositionFetcher<OriginStoryWoeth> {
  groupLabel = 'wOETH';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OriginStoryContractFactory) protected readonly contractFactory: OriginStoryContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): OriginStoryWoeth {
    return this.contractFactory.originStoryWoeth({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xdcee70654261af21c44c093c300ed3bb97b78192'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<OriginStoryWoeth>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<OriginStoryWoeth>) {
    const pricePerShareRaw = await contract.convertToAssets(BigNumber.from(10).pow(18).toString());
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return [pricePerShare];
  }
}
