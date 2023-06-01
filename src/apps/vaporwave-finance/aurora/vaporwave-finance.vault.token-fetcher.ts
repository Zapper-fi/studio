import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { VaporwaveFinanceVaultDefinitionsResolver } from '../common/vaporwave-finance.vault.token-definitions-resolver';
import { VaporwaveFinanceContractFactory, VaporwaveVault } from '../contracts';

type VaporwaveFinanceVaultDefinition = {
  address: string;
  underlyingTokenAddress: string;
  name: string;
  id: string;
};

@PositionTemplate()
export class AuroraVaporwaveFinanceVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  VaporwaveVault,
  DefaultAppTokenDataProps,
  VaporwaveFinanceVaultDefinition
> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VaporwaveFinanceContractFactory) protected readonly contractFactory: VaporwaveFinanceContractFactory,
    @Inject(VaporwaveFinanceVaultDefinitionsResolver)
    protected readonly vaultDefinitionResolver: VaporwaveFinanceVaultDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VaporwaveVault {
    return this.contractFactory.vaporwaveVault({ network: this.network, address });
  }

  async getDefinitions(): Promise<VaporwaveFinanceVaultDefinition[]> {
    return this.vaultDefinitionResolver.getVaultDefinitions();
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<VaporwaveVault, VaporwaveFinanceVaultDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<VaporwaveVault>) {
    const reserveRaw = await contract.balance();
    const reserve = Number(reserveRaw) / 10 ** appToken.decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }

  async getApy({
    definition,
  }: GetDataPropsParams<VaporwaveVault, DefaultAppTokenDataProps, VaporwaveFinanceVaultDefinition>) {
    const apyRaw = await this.vaultDefinitionResolver.getVaultApy(definition.id);
    return apyRaw * 100;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<
    VaporwaveVault,
    DefaultAppTokenDataProps,
    VaporwaveFinanceVaultDefinition
  >): Promise<string> {
    return definition.name;
  }
}
