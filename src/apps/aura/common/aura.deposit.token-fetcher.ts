import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetDefinitionsParams,
  GetAddressesParams,
  GetUnderlyingTokensParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { AuraViemContractFactory } from '../contracts';
import { AuraDepositToken } from '../contracts/viem';

type AuraDepositTokenDefinition = {
  address: string;
  poolIndex: number;
  booster: string;
};

export abstract class AuraDepositTokenFetcher extends AppTokenTemplatePositionFetcher<
  AuraDepositToken,
  DefaultAppTokenDataProps,
  AuraDepositTokenDefinition
> {
  groupLabel = 'Deposits';

  abstract boosterAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraViemContractFactory) protected readonly contractFactory: AuraViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.auraDepositToken({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<AuraDepositTokenDefinition[]> {
    const definitions = await Promise.all(
      this.boosterAddresses.map(async booster => {
        const boosterContract = this.contractFactory.auraBooster({
          address: booster,
          network: this.network,
        });
        const numOfPools = await boostercontract.read.poolLength();

        return Promise.all(
          range(0, Number(numOfPools)).flatMap(async poolIndex => {
            const poolInfo = await multicall.wrap(boosterContract).read.poolInfo([poolIndex]);
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

  async getPricePerShare() {
    return [1];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AuraDepositToken, DefaultAppTokenDataProps>) {
    return getLabelFromToken(appToken.tokens[0]!);
  }
}
