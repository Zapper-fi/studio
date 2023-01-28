import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { YearnVaultTokenDefinitionsResolver } from './yearn.vault.token-definitions-resolver';

export abstract class YearnVaultTokenFetcher<T extends Contract> extends AppTokenTemplatePositionFetcher<T> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnVaultTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: YearnVaultTokenDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  abstract vaultType: 'v1' | 'v2';
  abstract vaultsToIgnore: string[];

  protected getVaultDefinitions() {
    return this.tokenDefinitionsResolver.getVaultDefinitions({
      network: this.network,
      vaultsToIgnore: this.vaultsToIgnore,
      vaultType: this.vaultType,
    });
  }

  protected async selectVault(vaultAddress: string) {
    const vaultDefinitions = await this.getVaultDefinitions();
    return vaultDefinitions.find(v => v.address.toLowerCase() === vaultAddress) ?? null;
  }

  async getAddresses(): Promise<string[]> {
    const vaultDefinitions = await this.getVaultDefinitions();
    return vaultDefinitions.map(({ address }) => address.toLowerCase());
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<T>) {
    const vault = await this.selectVault(contract.address.toLowerCase());
    if (!vault) throw new Error('Cannot find specified vault');
    return [{ address: vault!.token.address.toLowerCase(), network: this.network }];
  }

  async getApy({ appToken }: GetDataPropsParams<T>) {
    const vault = await this.selectVault(appToken.address);
    if (!vault) throw new Error('Cannot find specified vault');

    const apy = vault.apy?.net_apy * 100;
    return apy;
  }
}
