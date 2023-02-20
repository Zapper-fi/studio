import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { GoldfinchContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumGoldfinchFiduTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'FIDU';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GoldfinchContractFactory) protected readonly contractFactory: GoldfinchContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses() {
    const FIDU = '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf';
    return [FIDU];
  }

  async getUnderlyingTokenDefinitions() {
    const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    return [{ address: USDC, network: this.network }];
  }

  async getPricePerShare({ multicall }: GetPricePerShareParams<Erc20>) {
    const seniorPoolAddress = '0x8481a6ebaf5c7dabc3f7e09e44a89531fd31f822';
    const seniorPool = this.contractFactory.goldfinchSeniorPool({ address: seniorPoolAddress, network: this.network });
    const sharePriceRaw = await multicall.wrap(seniorPool).sharePrice();
    return [Number(sharePriceRaw) / 10 ** 18];
  }
}
