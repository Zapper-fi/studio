import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { TeahouseVault, TeahouseContractFactory } from '../contracts';

export abstract class TeahouseVaultsTokenFetcher extends AppTokenTemplatePositionFetcher<TeahouseVault> {
  queryFilterFromBlock: number | null;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TeahouseContractFactory) protected readonly contractFactory: TeahouseContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.teahouseVault({ network: this.network, address });
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<TeahouseVault>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<TeahouseVault>) {
    const assetDecimals = appToken.decimals;
    const shareDecimals = await contract.decimals();
    const globalState = await contract.globalState();
    const currentIndex = globalState[2];
    const enterNextCycleEventFilter = contract.filters.EnterNextCycle(null, currentIndex - 1);
    const enterNextCycleEvent = await contract.queryFilter(
      enterNextCycleEventFilter,
      this.queryFilterFromBlock ?? undefined,
      undefined,
    );
    const priceNumerator = enterNextCycleEvent[0].args.priceNumerator;
    const priceDenominator = enterNextCycleEvent[0].args.priceDenominator;
    const pricePerShare =
      priceNumerator
        .mul('1' + '0'.repeat(shareDecimals))
        .mul(100000000)
        .div(priceDenominator)
        .div('1' + '0'.repeat(assetDecimals))
        .toNumber() / 100000000;
    return [pricePerShare];
  }
}
