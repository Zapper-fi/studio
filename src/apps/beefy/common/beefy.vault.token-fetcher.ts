import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BeefyViemContractFactory } from '../contracts';
import { BeefyVaultToken } from '../contracts/viem';

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
    @Inject(BeefyViemContractFactory) protected readonly contractFactory: BeefyViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.beefyVaultToken({ network: this.network, address });
  }

  async getDecimals({ appToken }: GetTokenPropsParams<BeefyVaultToken>): Promise<number> {
    return appToken.tokens[0].decimals;
  }

  async getDefinitions(): Promise<BeefyVaultTokenDefinition[]> {
    return this.tokenDefinitionsResolver.getVaultDefinitions(this.network);
  }

  async getAddresses({ definitions }: GetAddressesParams<BeefyVaultTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<BeefyVaultToken, BeefyVaultTokenDefinition>) {
    return [{ address: definition.underlyingAddress, network: this.network }];
  }

  async getPricePerShare({ contract, multicall }: GetPricePerShareParams<BeefyVaultToken>) {
    const ratioRaw = await multicall.wrap(contract).read.getPricePerFullShare();
    const ratio = Number(ratioRaw) / 10 ** 18;
    return [ratio];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BeefyVaultToken>) {
    return `${getLabelFromToken(appToken.tokens[0])} Vault`;
  }
}
