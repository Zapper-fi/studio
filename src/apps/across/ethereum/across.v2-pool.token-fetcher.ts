import { Inject } from '@nestjs/common';
import { uniq } from 'lodash';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AcrossContractFactory, AcrossV2PoolToken } from '../contracts';

export type AcrossV2PoolTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumAcrossV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  AcrossV2PoolToken,
  DefaultAppTokenDataProps,
  AcrossV2PoolTokenDefinition
> {
  groupLabel = 'V2 Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossContractFactory) protected readonly contractFactory: AcrossContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AcrossV2PoolToken {
    return this.contractFactory.acrossV2PoolToken({ network: this.network, address });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<AcrossV2PoolTokenDefinition[]> {
    const hub = this.contractFactory.acrossV2HubPool({
      address: '0xc186fa914353c44b2e33ebe05f21846f1048beda',
      network: this.network,
    });

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

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<AcrossV2PoolToken>) {
    return [];
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<AcrossV2PoolToken>) {
    // int256 numerator = int256(pooledToken.liquidReserves) +
    // pooledToken.utilizedReserves -
    // int256(pooledToken.undistributedLpFees);
    return [];
  }

  async getLiquidity({ contract, appToken }: GetDataPropsParams<AcrossV2PoolToken>) {
    return 0;
  }

  async getReserves({ contract, appToken }: GetDataPropsParams<AcrossV2PoolToken>) {
    // const reserveRaw = await contract.liquidReserves();
    // return [Number(reserveRaw) / 10 ** appToken.tokens[0].decimals];
    return [];
  }

  async getApy(_params: GetDataPropsParams<AcrossV2PoolToken>) {
    return 0;
  }
}
