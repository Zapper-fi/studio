import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { BeethovenXContractFactory } from '../contracts';
import { BeethovenXBeetsBar } from '../contracts/ethers/BeethovenXBeetsBar';

@PositionTemplate()
export class FantomBeethovenXFBeetsTokenFetcher extends AppTokenTemplatePositionFetcher<BeethovenXBeetsBar> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXContractFactory) protected readonly contractFactory: BeethovenXContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    return ['0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1'];
  }

  getContract(address: string): BeethovenXBeetsBar {
    return this.contractFactory.beethovenXBeetsBar({ address, network: this.network });
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<BeethovenXBeetsBar>) {
    return contract.vestingToken();
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<BeethovenXBeetsBar>) {
    const underlying = appToken.tokens[0];
    const underlyingTokenContract = this.contractFactory.erc20({ address: underlying.address, network: this.network });
    const reserveRaw = await multicall.wrap(underlyingTokenContract).balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** underlying.decimals;
    return reserve / appToken.supply;
  }
}
