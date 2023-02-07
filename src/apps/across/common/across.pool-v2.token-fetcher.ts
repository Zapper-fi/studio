import { Inject } from '@nestjs/common';
import { uniq } from 'lodash';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AcrossContractFactory, AcrossPoolV2 } from '../contracts';

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

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossContractFactory) protected readonly contractFactory: AcrossContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AcrossPoolV2 {
    return this.contractFactory.acrossPoolV2({ network: this.network, address });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<AcrossPoolV2TokenDefinition[]> {
    const hub = this.contractFactory.acrossHubPoolV2({ address: this.hubAddress, network: this.network });
    const logs = await hub.queryFilter(hub.filters.LiquidityAdded(), 14819537);
    const collateral = uniq(logs.map(v => v.args.l1Token.toLowerCase()));

    const lpTokens = await Promise.all(collateral.map(c => multicall.wrap(hub).pooledTokens(c)));
    const definitions = collateral.map((c, i) => ({
      address: lpTokens[i].lpToken.toLowerCase(),
      underlyingTokenAddress: c,
    }));

    return definitions;
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
    const poolInfo = await multicall.wrap(hub).pooledTokens(appToken.tokens[0].address);
    const reserveRaw = poolInfo.liquidReserves.add(poolInfo.utilizedReserves).sub(poolInfo.undistributedLpFees);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve / appToken.supply];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AcrossPoolV2>): Promise<string> {
    return `${getLabelFromToken(appToken.tokens[0])} Pool`;
  }
}
