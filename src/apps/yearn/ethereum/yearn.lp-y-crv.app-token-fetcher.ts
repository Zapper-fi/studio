import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { LpYCrv, YearnContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumLpYCrvTokenTokenFetcher extends AppTokenTemplatePositionFetcher<LpYCrv> {
  groupLabel = 'LP yCRV';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) protected readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LpYCrv {
    return this.contractFactory.lpYCrv({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0xc97232527b62efb0d8ed38cf3ea103a6cca4037e'];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<LpYCrv>) {
    return contract.token();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<LpYCrv>): Promise<number> {
    const pricePerShareRaw = await contract.pricePerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return pricePerShare;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<LpYCrv>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<LpYCrv>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
