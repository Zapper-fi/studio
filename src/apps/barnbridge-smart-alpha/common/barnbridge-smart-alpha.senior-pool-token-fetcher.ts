import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetPriceParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BarnbridgeSmartAlphaContractFactory, BarnbridgeSmartAlphaPool } from '../contracts';
import { BarnbridgeSmartAlphaSeniorPoolTokenDefinition } from '../ethereum/barnbridge-smart-alpha.senior-pool.token-fetcher';

export abstract class BarnbridgeSmartAlphaSeniorPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BarnbridgeSmartAlphaPool,
  DefaultDataProps,
  BarnbridgeSmartAlphaSeniorPoolTokenDefinition
> {
  minLiquidity = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BarnbridgeSmartAlphaContractFactory)
    protected readonly contractFactory: BarnbridgeSmartAlphaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BarnbridgeSmartAlphaPool {
    return this.contractFactory.barnbridgeSmartAlphaPool({ network: this.network, address });
  }

  async getAddresses({
    definitions,
  }: GetAddressesParams<BarnbridgeSmartAlphaSeniorPoolTokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<BarnbridgeSmartAlphaPool, BarnbridgeSmartAlphaSeniorPoolTokenDefinition>) {
    return [definition.underlyingTokenAddress];
  }

  async getPrice({
    multicall,
    definition,
    appToken,
  }: GetPriceParams<
    BarnbridgeSmartAlphaPool,
    DefaultDataProps,
    BarnbridgeSmartAlphaSeniorPoolTokenDefinition
  >): Promise<number> {
    const alphaPoolContract = this.contractFactory.barnbridgeSmartAlphaPool({
      address: definition.smartPoolAddress,
      network: this.network,
    });
    const seniorTokenPriceInUnderlyingRaw = await multicall.wrap(alphaPoolContract).estimateCurrentSeniorTokenPrice();
    const seniorTokenPriceInUnderlying = Number(seniorTokenPriceInUnderlyingRaw) / 10 ** 18;
    return Number(seniorTokenPriceInUnderlying) * appToken.tokens[0].price;
  }

  async getDataProps({ appToken }: GetDataPropsParams<BarnbridgeSmartAlphaPool, DefaultDataProps>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }
}
