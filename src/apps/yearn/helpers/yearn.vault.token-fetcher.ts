import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  AppTokenTemplatePositionFetcher,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';

import { YearnVaultTokenDefinitionsResolver } from '../helpers/yearn.vault.token-definitions-resolver';

export type YearnVaultTokenDataProps = {
  liquidity: number;
  reserve: number;
  isBlocked: boolean;
  apy: number;
};

export abstract class YearnVaultTokenFetcher<T extends Contract> extends AppTokenTemplatePositionFetcher<
  T,
  YearnVaultTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnVaultTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: YearnVaultTokenDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  abstract vaultType: 'v1' | 'v2';
  abstract vaultsToIgnore: string[];

  private getVaultDefinitions() {
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

  async getUnderlyingTokenAddresses({ contract }: UnderlyingTokensStageParams<T>): Promise<string[]> {
    const vault = await this.selectVault(contract.address.toLowerCase());
    if (!vault) throw new Error('Cannot find specified vault');

    return [vault.token.address.toLowerCase()];
  }
}
