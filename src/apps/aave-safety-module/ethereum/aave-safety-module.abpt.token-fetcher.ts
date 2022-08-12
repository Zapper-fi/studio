import { Inject } from '@nestjs/common';
import { sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
  PricePerShareStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveAbpt, AaveSafetyModuleContractFactory } from '../contracts';

type AaveSafetyModuleAbptTokenDataProps = {
  reserves: number[];
  liquidity: number;
  fee: number;
};

const appId = AAVE_SAFETY_MODULE_DEFINITION.id;
const groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.abpt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAaveSafetyModuleAbptTokenFetcher extends AppTokenTemplatePositionFetcher<
  AaveAbpt,
  AaveSafetyModuleAbptTokenDataProps
> {
  appId = AAVE_SAFETY_MODULE_DEFINITION.id;
  groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.abpt.id;
  network = Network.ETHEREUM_MAINNET;

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

  async getUnderlyingTokenAddresses(_params: UnderlyingTokensStageParams<AaveAbpt>): Promise<string | string[]> {
    return ['0xc697051d1c6296c24ae3bcef39aca743861d9a81'];
  }

  async getPricePerShare({
    appToken,
    multicall,
    tokenLoader,
  }: PricePerShareStageParams<AaveAbpt, AaveSafetyModuleAbptTokenDataProps>) {
    const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const aaveAddress = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';

    const tokenRequests = [wethAddress, aaveAddress].map(v => ({ address: v, network: this.network }));
    const [wethToken, aaveToken] = await tokenLoader.getMany(tokenRequests);
    if (!wethToken || !aaveToken) return null as any; // force throw

    const poolToken = this.contractFactory.aaveBpt({
      address: appToken.tokens[0].address,
      network: this.network,
    });

    const [wethReserveRaw, aaveReserveRaw] = await Promise.all([
      multicall.wrap(poolToken).getBalance(wethAddress),
      multicall.wrap(poolToken).getBalance(aaveAddress),
    ]);

    const aaveReserve = Number(aaveReserveRaw) / 10 ** aaveToken.decimals;
    const wethReserve = Number(wethReserveRaw) / 10 ** wethToken.decimals;
    return [aaveReserve / appToken.supply, wethReserve / appToken.supply];
  }

  async getDataProps({ appToken }: DataPropsStageParams<AaveAbpt, AaveSafetyModuleAbptTokenDataProps>) {
    const fee = 0.03;
    const reserves = (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
    const liquidity = sum(reserves.map((v, i) => v * appToken.tokens[i].price));
    return { fee, reserves, liquidity };
  }

  async getLabel({ appToken }: DisplayPropsStageParams<AaveAbpt, AaveSafetyModuleAbptTokenDataProps>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: DisplayPropsStageParams<AaveAbpt, AaveSafetyModuleAbptTokenDataProps>) {
    const { reserves, liquidity } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }
}
