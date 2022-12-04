import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { AladdinFxs, ConcentratorContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorAfxsTokenFetcher extends AppTokenTemplatePositionFetcher<AladdinFxs> {
  groupLabel = 'aFxs';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AladdinFxs {
    return this.contractFactory.aladdinFxs({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xdaf03d70fe637b91ba6e521a32e1fb39256d3ec9'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7'];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<AladdinFxs>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AladdinFxs>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<AladdinFxs>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<AladdinFxs>) {
    return 0;
  }
}
