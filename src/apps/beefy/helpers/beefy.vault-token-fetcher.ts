import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  PricePerShareStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';

import { BeefyContractFactory } from '../contracts';

import { BeefyVaultTokenDefinitionsResolver } from './beefy.vault.token-definition-resolver';

export type BeefyVaultTokenDataProps = {
  liquidity: number;
};

export abstract class BeefyVaultTokenFetcher<T extends Contract> extends AppTokenTemplatePositionFetcher<
  T,
  BeefyVaultTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeefyVaultTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: BeefyVaultTokenDefinitionsResolver,
    @Inject(BeefyContractFactory) protected readonly contractFactory: BeefyContractFactory,
  ) {
    super(appToolkit);
  }

  private getVaultDefinitions() {
    return this.tokenDefinitionsResolver.getVaultDefinitions(this.network);
  }

  protected async selectVault(vaultAddress: string) {
    const vaultDefinitions = await this.getVaultDefinitions();
    return vaultDefinitions.find(v => v.address.toLowerCase() === vaultAddress) ?? null;
  }

  async getAddresses(): Promise<string[]> {
    const vaultDefinitions = await this.getVaultDefinitions();
    return vaultDefinitions.map(({ address }) => address.toLowerCase());
  }

  async getUnderlyingTokenAddresses({ contract }: UnderlyingTokensStageParams<T>): Promise<string[]> {
    const vault = await this.selectVault(contract.address.toLowerCase());
    if (!vault) throw new Error('Cannot find specified vault');

    return [vault.underlyingAddress.toLowerCase()];
  }

  async getPricePerShare({ contract, appToken, multicall }: PricePerShareStageParams<T>): Promise<number | number[]> {
    const ratioRaw = await multicall.wrap(contract).getPricePerFullShare();
    const decimals = appToken.decimals;

    return Number(ratioRaw) / 10 ** decimals;
  }

  async getDataProps(opts: DataPropsStageParams<T, BeefyVaultTokenDataProps>) {
    const { appToken } = opts;
    const reserve = Number(appToken.pricePerShare) * appToken.supply;
    const liquidity = reserve * appToken.tokens[0].price;

    return { liquidity };
  }
}
