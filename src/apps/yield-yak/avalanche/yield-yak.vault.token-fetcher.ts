import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { YieldYakContractFactory, YieldYakVault } from '../contracts';
import { YieldYakVaultTokenDefinitionsResolver } from '../helpers/yield-yak.vault.token-definitions-resolver';

@PositionTemplate()
export class AvalancheYieldyakVaultTokenFetcher extends AppTokenTemplatePositionFetcher<YieldYakVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldYakContractFactory) private readonly contractFactory: YieldYakContractFactory,
    @Inject(YieldYakVaultTokenDefinitionsResolver)
    protected readonly tokenDefinitionsResolver: YieldYakVaultTokenDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  private getVaultDefinitions() {
    return this.tokenDefinitionsResolver.getVaultDefinitionsData();
  }

  private async selectVault(vaultAddress: string) {
    const vaultDefinitions = await this.getVaultDefinitions();
    return vaultDefinitions.find(v => v.id.toLowerCase() === vaultAddress) ?? null;
  }

  getContract(address: string): YieldYakVault {
    return this.contractFactory.yieldYakVault({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const vaultDefinitions = await this.getVaultDefinitions();
    return vaultDefinitions.map(address => address.id.toLowerCase());
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<YieldYakVault>) {
    const vault = await this.selectVault(contract.address.toLowerCase());
    if (!vault) throw new Error('Cannot find specified vault');

    return [vault.depositToken.id.toLowerCase()];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<YieldYakVault, DefaultDataProps>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getDataProps(opts: GetDataPropsParams<YieldYakVault, DefaultDataProps>): Promise<DefaultDataProps> {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;

    return { liquidity };
  }
}
