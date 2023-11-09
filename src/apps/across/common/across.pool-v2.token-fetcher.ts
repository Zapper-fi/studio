import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AcrossViemContractFactory } from '../contracts';
import { AcrossPoolV2 } from '../contracts/viem';
import { BigNumber } from 'ethers';

export type AcrossPoolV2TokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export abstract class AcrossPoolV2TokenFetcher extends AppTokenTemplatePositionFetcher<
  AcrossPoolV2,
  DefaultAppTokenDataProps,
  AcrossPoolV2TokenDefinition
> {
  abstract hubAddress: string;
  abstract poolDefinitions: AcrossPoolV2TokenDefinition[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossViemContractFactory) protected readonly contractFactory: AcrossViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.acrossPoolV2({ network: this.network, address });
  }

  async getDefinitions(): Promise<AcrossPoolV2TokenDefinition[]> {
    return this.poolDefinitions;
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<AcrossPoolV2, AcrossPoolV2TokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<AcrossPoolV2>) {
    const hub = this.contractFactory.acrossHubPoolV2({ address: this.hubAddress, network: this.network });
    const poolInfo = await multicall.wrap(hub).read.pooledTokens([appToken.tokens[0].address]);
    const reserveRaw = BigNumber.from(poolInfo[4]).add(poolInfo[3]).sub(poolInfo[5]);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve / appToken.supply];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AcrossPoolV2>): Promise<string> {
    return `${getLabelFromToken(appToken.tokens[0])} Pool`;
  }
}
