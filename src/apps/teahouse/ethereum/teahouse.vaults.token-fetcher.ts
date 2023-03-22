import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { TeahouseVault, TeahouseContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumTeahouseVaultsTokenFetcher extends AppTokenTemplatePositionFetcher<TeahouseVault> {
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
      '0xe1b3c128c0d0a9e41ab3ff8f0984e5d5bef81677',
      '0xb54e2764bef6994245527f75eb8f180c484c404d',
      '0x478afa95f40bf5504cff32796c20bfd0b4e38330',
      '0x9ed9c1c0f1c68666668a7aedec5fec95abc7f943',
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
