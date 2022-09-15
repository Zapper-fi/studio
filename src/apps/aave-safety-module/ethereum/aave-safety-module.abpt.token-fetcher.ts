import { Inject } from '@nestjs/common';
import { sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AaveAbpt, AaveSafetyModuleContractFactory } from '../contracts';

type AaveSafetyModuleAbptTokenDataProps = {
  reserves: number[];
  liquidity: number;
  fee: number;
};

@PositionTemplate()
export class EthereumAaveSafetyModuleAbptTokenFetcher extends AppTokenTemplatePositionFetcher<
  AaveAbpt,
  AaveSafetyModuleAbptTokenDataProps
> {
  groupLabel = 'ABPT';

  readonly bptAddress = '0xc697051d1c6296c24ae3bcef39aca743861d9a81';
  readonly abptAddress = '0x41a08648c3766f9f9d85598ff102a08f4ef84f84';
  readonly aaveAddress = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
  readonly wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) protected readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AaveAbpt {
    return this.contractFactory.aaveAbpt({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x41a08648c3766f9f9d85598ff102a08f4ef84f84'];
  }

  async getUnderlyingTokenAddresses(_params: GetUnderlyingTokensParams<AaveAbpt>): Promise<string | string[]> {
    return [this.aaveAddress, this.wethAddress];
  }

  async getPricePerShare({
    appToken,
    multicall,
  }: GetPricePerShareParams<AaveAbpt, AaveSafetyModuleAbptTokenDataProps>) {
    const poolToken = this.contractFactory.aaveBpt({
      address: this.bptAddress,
      network: this.network,
    });

    const [wethReserveRaw, aaveReserveRaw] = await Promise.all([
      multicall.wrap(poolToken).getBalance(this.wethAddress),
      multicall.wrap(poolToken).getBalance(this.aaveAddress),
    ]);

    const aaveReserve = Number(aaveReserveRaw) / 10 ** 18;
    const wethReserve = Number(wethReserveRaw) / 10 ** 18;
    return [aaveReserve / appToken.supply, wethReserve / appToken.supply];
  }

  async getDataProps({ appToken }: GetDataPropsParams<AaveAbpt, AaveSafetyModuleAbptTokenDataProps>) {
    const fee = 0.003;
    const reserves = (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
    const liquidity = sum(reserves.map((v, i) => v * appToken.tokens[i].price));
    return { fee, reserves, liquidity };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AaveAbpt, AaveSafetyModuleAbptTokenDataProps>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<AaveAbpt, AaveSafetyModuleAbptTokenDataProps>) {
    const { reserves, liquidity } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }
}
