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
  booster: string;
};

@PositionTemplate()
export class EthereumAuraDepositTokenFetcher extends AppTokenTemplatePositionFetcher<
  AuraDepositToken,
  DefaultAppTokenDataProps,
  AuraDepositTokenDefinition
> {
  groupLabel = 'Deposits';

  BOOSTER_V1_ADDRESS = '0x7818a1da7bd1e64c199029e86ba244a9798eee10';
  BOOSTER_V2_ADDRESS = '0xa57b8d98dae62b26ec3bcc4a365338157060b234';

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
    const definitions = await Promise.all(
      [this.BOOSTER_V1_ADDRESS, this.BOOSTER_V2_ADDRESS].map(async booster => {
        const boosterContract = this.contractFactory.auraBooster({
          address: booster,
          network: this.network,
        });
        const numOfPools = await boosterContract.poolLength();

        return Promise.all(
          range(0, Number(numOfPools)).flatMap(async poolIndex => {
            const poolInfo = await multicall.wrap(boosterContract).poolInfo(poolIndex);
            return {
              address: poolInfo.token.toLowerCase(),
              poolIndex,
              booster,
            };
          }),
        );
      }),
    );

    return definitions.flat();
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<AuraDepositToken, AuraDepositTokenDefinition>) {
    const boosterContract = this.contractFactory.auraBooster({ address: definition.booster, network: this.network });
    const poolInfo = await boosterContract.poolInfo(definition.poolIndex);
    return [{ address: poolInfo.lptoken, network: this.network }];
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

  async getTertiaryLabel(
    params: GetDisplayPropsParams<AuraDepositToken, DefaultAppTokenDataProps, AuraDepositTokenDefinition>,
  ) {
    if (params.definition.booster === this.BOOSTER_V1_ADDRESS) {
      return `Needs migration`;
    }
    return super.getTertiaryLabel(params);
  }
}
