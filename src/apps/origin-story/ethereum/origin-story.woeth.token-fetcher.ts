import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { OriginStoryViemContractFactory } from '../contracts';
import { OriginStoryWoeth } from '../contracts/viem';

@PositionTemplate()
export class EthereumOriginStoryWoethTokenFetcher extends AppTokenTemplatePositionFetcher<OriginStoryWoeth> {
  groupLabel = 'wOETH';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OriginStoryViemContractFactory) protected readonly contractFactory: OriginStoryViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.originStoryWoeth({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xdcee70654261af21c44c093c300ed3bb97b78192'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<OriginStoryWoeth>) {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<OriginStoryWoeth>) {
    const oneUnit = BigNumber.from(10).pow(18).toString();
    const pricePerShareRaw = await contract.read.convertToAssets([BigInt(oneUnit)]);
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return [pricePerShare];
  }
}
