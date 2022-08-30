import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { UnagiiContractFactory, UnagiiUtoken } from '../contracts';

export type UnagiiTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
  vaultManagerAddress: string;
};

export abstract class UnagiiVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  UnagiiUtoken,
  DefaultDataProps,
  UnagiiTokenDefinition
> {
  abstract vaultManagerAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UnagiiContractFactory) protected readonly contractFactory: UnagiiContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }): Promise<UnagiiTokenDefinition[]> {
    const vaultDefinitions = await Promise.all(
      this.vaultManagerAddresses.map(async vaultAddress => {
        const vaultManagerContract = this.contractFactory.unagiiV2Vault({
          address: vaultAddress,
          network: this.network,
        });
        const [uTokenAddress, underlyingTokenAddressRaw] = await Promise.all([
          multicall.wrap(vaultManagerContract).uToken(),
          multicall.wrap(vaultManagerContract).token(),
        ]);
        return {
          address: uTokenAddress.toLowerCase(),
          underlyingTokenAddress: underlyingTokenAddressRaw.toLowerCase(),
          vaultManagerAddress: vaultAddress,
        };
      }),
    );

    return vaultDefinitions;
  }

  getContract(address: string) {
    return this.contractFactory.unagiiUtoken({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams<UnagiiTokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getPricePerShare({
    multicall,
    appToken,
    definition,
  }: GetPricePerShareParams<UnagiiUtoken, DefaultAppTokenDefinition, UnagiiTokenDefinition>) {
    const vaultManagerContract = this.contractFactory.unagiiV2Vault({
      address: definition.vaultManagerAddress,
      network: this.network,
    });
    const totalAssetsRaw = await multicall.wrap(vaultManagerContract).totalAssets();
    const underlyingAssets = Number(totalAssetsRaw) / 10 ** appToken.tokens[0].decimals;
    return underlyingAssets / appToken.supply;
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<UnagiiUtoken, UnagiiTokenDefinition>): Promise<string[]> {
    const underlyingTokenAddress =
      definition.underlyingTokenAddress === ETH_ADDR_ALIAS ? ZERO_ADDRESS : definition.underlyingTokenAddress;
    return [underlyingTokenAddress];
  }

  async getDataProps(opts: GetDataPropsParams<UnagiiUtoken, DefaultDataProps>): Promise<DefaultDataProps> {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;

    return { liquidity };
  }
}
