import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BeefyContractFactory, BeefyVaultToken } from '../contracts';

import { BeefyVaultTokenDefinitionsResolver } from './beefy.vault.token-definition-resolver';

export type BeefyVaultTokenDefinition = {
  address: string;
  underlyingAddress: string;
  id: string;
  marketName: string;
  symbol: string;
};

export abstract class BeefyVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  BeefyVaultToken,
  DefaultAppTokenDataProps,
  BeefyVaultTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeefyVaultTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: BeefyVaultTokenDefinitionsResolver,
    @Inject(BeefyContractFactory) protected readonly contractFactory: BeefyContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BeefyVaultToken {
    return this.contractFactory.beefyVaultToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<BeefyVaultTokenDefinition[]> {
    return this.tokenDefinitionsResolver.getVaultDefinitions(this.network);
  }

  async getAddresses({ definitions }: GetAddressesParams<BeefyVaultTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<BeefyVaultToken, BeefyVaultTokenDefinition>) {
    return definition.underlyingAddress;
  }

  async getPricePerShare({
    contract,
    appToken,
    multicall,
  }: GetPricePerShareParams<BeefyVaultToken>): Promise<number | number[]> {
    const ratioRaw = await multicall.wrap(contract).getPricePerFullShare();
    const decimals = appToken.decimals;

    return Number(ratioRaw) / 10 ** decimals;
  }

  getLiquidity({ appToken }: GetDataPropsParams<BeefyVaultToken>) {
    return appToken.supply * appToken.price;
  }

  getReserves({ appToken }: GetDataPropsParams<BeefyVaultToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  getApy(_params: GetDataPropsParams<BeefyVaultToken>) {
    return 0;
  }
}
