import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { TeahouseViemContractFactory } from '../contracts';
import { TeahouseVault } from '../contracts/viem';

export abstract class TeahouseVaultsTokenFetcher extends AppTokenTemplatePositionFetcher<TeahouseVault> {
  fromBlock: number;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TeahouseViemContractFactory) protected readonly contractFactory: TeahouseViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.teahouseVault({ network: this.network, address });
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<TeahouseVault>) {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<TeahouseVault>) {
    const assetDecimals = appToken.decimals;
    const shareDecimals = await contract.read.decimals();
    const globalState = await contract.read.globalState();
    const currentIndex = globalState[2];

    const enterNextCycleEvents = await contract.getEvents.EnterNextCycle(
      { cycleIndex: currentIndex - 1 },
      { fromBlock: BigInt(this.fromBlock), toBlock: 'latest' },
    );

    if (!enterNextCycleEvents.length) return [0];

    const priceNumerator = enterNextCycleEvents[0].args.priceNumerator;
    const priceDenominator = enterNextCycleEvents[0].args.priceDenominator;
    const pricePerShare =
      BigNumber.from(priceNumerator)
        .mul('1' + '0'.repeat(shareDecimals))
        .mul(100000000)
        .div(BigNumber.from(priceDenominator))
        .div('1' + '0'.repeat(assetDecimals))
        .toNumber() / 100000000;

    return [pricePerShare];
  }
}
