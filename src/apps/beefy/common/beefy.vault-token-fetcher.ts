import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  PricePerShareStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';

import { BeefyContractFactory, BeefyVaultToken } from '../contracts';

import { BeefyVaultTokenDefinitionsResolver } from './beefy.vault.token-definition-resolver';

export type BeefyVaultTokenDataProps = {
  liquidity: number;
};

export abstract class BeefyVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  BeefyVaultToken,
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

  getContract(address: string): BeefyVaultToken {
    return this.contractFactory.beefyVaultToken({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const vaultDefinitions = await this.tokenDefinitionsResolver.getVaultDefinitions(this.network);
    return vaultDefinitions.map(({ address }) => address.toLowerCase());
  }

  async getUnderlyingTokenAddresses({ address }: UnderlyingTokensStageParams<BeefyVaultToken>): Promise<string[]> {
    const vaultDefinitions = await this.tokenDefinitionsResolver.getVaultDefinitions(this.network);
    const vault = vaultDefinitions.find(v => v.address.toLowerCase() === address) ?? null;
    if (!vault) throw new Error('Cannot find specified vault');

    return [vault.underlyingAddress.toLowerCase()];
  }

  async getPricePerShare({
    contract,
    appToken,
  }: PricePerShareStageParams<BeefyVaultToken>): Promise<number | number[]> {
    const ratioRaw = contract.getPricePerFullShare();
    const decimals = appToken.decimals;

    return Number(ratioRaw) / 10 ** decimals;
  }

  async getDataProps(opts: DataPropsStageParams<BeefyVaultToken, BeefyVaultTokenDataProps>) {
    const { appToken } = opts;
    const reserve = Number(appToken.pricePerShare) * appToken.supply;
    const liquidity = reserve * appToken.tokens[0].price;

    return { liquidity };
  }
}
