import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { DineroViemContractFactory } from '../contracts';
import { DineroApxeth } from '../contracts/viem/DineroApxeth';

@PositionTemplate()
export class EthereumDineroApxethTokenFetcher extends AppTokenTemplatePositionFetcher<DineroApxeth> {
  groupLabel = 'apxETH';

  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DineroViemContractFactory) protected readonly dineroContractFactory: DineroViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.dineroContractFactory.dineroApxeth({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x9ba021b0a9b958b5e75ce9f6dff97c7ee52cb3e6'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<DineroApxeth>) {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<DineroApxeth>) {
    const totalSupply = await contract.read.totalSupply();
    const totalAssets = await contract.read.totalAssets();
    return Number(totalSupply) == 0 ? [1] : [Number(totalAssets) / Number(totalSupply)];
  }
}
