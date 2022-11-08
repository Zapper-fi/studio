import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { AladdinCrv, ConcentratorContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorAcrvTokenFetcher extends AppTokenTemplatePositionFetcher<AladdinCrv> {
  groupLabel = 'aCRV';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AladdinCrv {
    return this.contractFactory.aladdinCrv({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x2b95a1dcc3d405535f9ed33c219ab38e8d7e0884'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7'];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<AladdinCrv>) {
    const reserveRaw = await contract.totalUnderlying();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AladdinCrv>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<AladdinCrv>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<AladdinCrv>) {
    return 0;
  }
}
