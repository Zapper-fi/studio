import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { YearnContractFactory, YearnLpYCrv } from '../contracts';

@PositionTemplate()
export class EthereumYearnLpYCrvTokenTokenFetcher extends AppTokenTemplatePositionFetcher<YearnLpYCrv> {
  groupLabel = 'LP yCRV';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) protected readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YearnLpYCrv {
    return this.contractFactory.yearnLpYCrv({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0xc97232527b62efb0d8ed38cf3ea103a6cca4037e'];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<YearnLpYCrv>) {
    return contract.token();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<YearnLpYCrv>): Promise<number> {
    const pricePerShareRaw = await contract.pricePerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return pricePerShare;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<YearnLpYCrv>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<YearnLpYCrv>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
