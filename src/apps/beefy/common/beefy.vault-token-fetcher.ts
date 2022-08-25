import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BeefyContractFactory, BeefyVaultToken } from '../contracts';

import { BeefyVaultTokenDefinitionsResolver } from './beefy.vault.token-definition-resolver';

export type BeefyVaultTokenDataProps = {
  liquidity: number;
};

export type BeefyVaultTokenDefinition = {
  address: string;
  underlyingAddress: string;
  id: string;
  marketName: string;
  symbol: string;
};

export abstract class BeefyVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  BeefyVaultToken,
  BeefyVaultTokenDataProps,
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

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<BeefyVaultToken>): Promise<number | number[]> {
    const ratioRaw = contract.getPricePerFullShare();
    const decimals = appToken.decimals;

    return Number(ratioRaw) / 10 ** decimals;
  }

  async getDataProps(opts: GetDataPropsParams<BeefyVaultToken, BeefyVaultTokenDataProps>) {
    const { appToken } = opts;
    const reserve = Number(appToken.pricePerShare) * appToken.supply;
    const liquidity = reserve * appToken.tokens[0].price;

    return { liquidity };
  }
}
