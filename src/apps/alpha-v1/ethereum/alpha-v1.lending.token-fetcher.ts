import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetPricePerShareParams,
  DefaultAppTokenDefinition,
  GetPriceParams,
} from '~position/template/app-token.template.types';

import { AlphaBank, AlphaV1ContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumAlphaV1LendingTokenFetcher extends AppTokenTemplatePositionFetcher<AlphaBank> {
  groupLabel = 'Lending';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AlphaV1ContractFactory) protected readonly contractFactory: AlphaV1ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AlphaBank {
    return this.contractFactory.alphaBank({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x67b66c99d3eb37fa76aa3ed1ff33e8e39f0b9c7a'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x0000000000000000000000000000000000000000'];
  }

  async getPrice({
    appToken,
    contract,
  }: GetPriceParams<AlphaBank, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<number> {
    const ethPrice = appToken.tokens[0].price;
    const [totalEthRaw, totalSupplyRaw] = await Promise.all([contract.totalETH(), contract.totalSupply()]);

    return (ethPrice * Number(totalEthRaw)) / Number(totalSupplyRaw);
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<AlphaBank>): Promise<number> {
    const [totalEthRaw, totalSupplyRaw] = await Promise.all([contract.totalETH(), contract.totalSupply()]);
    return Number(totalEthRaw) / Number(totalSupplyRaw);
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AlphaBank>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken, contract }: GetDataPropsParams<AlphaBank>) {
    const totalEthRaw = await contract.totalETH();
    return [Number(totalEthRaw) / 10 ** appToken.tokens[0].decimals];
  }

  async getApy({ contract }: GetDataPropsParams<AlphaBank>) {
    const [totalEthRaw, totalDebtValueRaw] = await Promise.all([contract.totalETH(), contract.glbDebtVal()]);

    const utilizationRate = new BigNumber(totalDebtValueRaw.div(totalEthRaw).toString());

    const tripleSlope = utilizationRate.lt(new BigNumber(0.8))
      ? utilizationRate.times(new BigNumber(0.1)).div(new BigNumber(0.8))
      : utilizationRate.lt(new BigNumber(0.9))
      ? new BigNumber(0.1)
      : new BigNumber(0.1).plus(
          utilizationRate.minus(new BigNumber(0.9)).times(new BigNumber(0.4)).div(new BigNumber(0.1)),
        );

    return tripleSlope.times(utilizationRate).times(0.9).toNumber();
  }
}
