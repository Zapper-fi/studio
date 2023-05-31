import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { TeahouseVault, TeahouseContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumTeahouseVaultsTokenFetcher extends AppTokenTemplatePositionFetcher<TeahouseVault> {
  groupLabel = 'Vault share';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TeahouseContractFactory) protected readonly contractFactory: TeahouseContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.teahouseVault({ network: this.network, address });
  }

  async getAddresses() {
    return [
      '0x9f4fff022ebff0cbfa3faf702911d0f658a4ba9b'
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<TeahouseVault>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract }) {
    const assetAddress = await contract.asset();
    const assetContract = this.getContract(assetAddress);
    const assetDecimals = await assetContract.decimals();
    const shareDecimals = await contract.decimals();
    const globalState = await contract.globalState();
    const currentIndex = globalState[2];
    const enterNextCycleEventFilter = await contract.filters.EnterNextCycle(null, currentIndex - 1);
    const enterNextCycleEvent = await contract.queryFilter(enterNextCycleEventFilter, null, null);
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
