import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetDefinitionsParams,
  GetAddressesParams,
  GetUnderlyingTokensParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { AuraContractFactory, AuraDepositToken } from '../contracts';

type AuraDepositTokenDefinition = {
  address: string;
  poolIndex: number;
};

@PositionTemplate()
export class EthereumAuraDepositTokenFetcher extends AppTokenTemplatePositionFetcher<
  AuraDepositToken,
  DefaultAppTokenDataProps,
  AuraDepositTokenDefinition
> {
  groupLabel = 'Deposits';

  BOOSTER_ADDRESS = '0x7818a1da7bd1e64c199029e86ba244a9798eee10';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) protected readonly contractFactory: AuraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraDepositToken {
    return this.contractFactory.auraDepositToken({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<AuraDepositTokenDefinition[]> {
    const boosterContract = this.contractFactory.auraBooster({ address: this.BOOSTER_ADDRESS, network: this.network });
    const numOfPools = await boosterContract.poolLength();

    const definitions = await Promise.all(
      range(0, Number(numOfPools)).flatMap(async poolIndex => {
        const poolInfo = await multicall.wrap(boosterContract).poolInfo(poolIndex);
        return { address: poolInfo.token.toLowerCase(), poolIndex };
      }),
    );

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<AuraDepositToken, AuraDepositTokenDefinition>) {
    const boosterContract = this.contractFactory.auraBooster({ address: this.BOOSTER_ADDRESS, network: this.network });
    const poolInfo = await boosterContract.poolInfo(definition.poolIndex);
    return poolInfo.lptoken;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AuraDepositToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<AuraDepositToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<AuraDepositToken>) {
    return 0;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AuraDepositToken, DefaultAppTokenDataProps>) {
    return getLabelFromToken(appToken.tokens[0]!);
  }
}
