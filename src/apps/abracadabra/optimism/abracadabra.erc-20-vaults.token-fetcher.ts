import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { AbracadabraContractFactory, AbracadabraErc20Vault } from '../contracts';

import { OPTIMISM_ERC20_VAULT_CAULDRONS } from './abracadabra.optimism.constants';

@PositionTemplate()
export class OptimismAbracadabraErc20VaultsTokenFetcher extends AppTokenTemplatePositionFetcher<AbracadabraErc20Vault> {
  groupLabel = 'Erc20Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) protected readonly contractFactory: AbracadabraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AbracadabraErc20Vault {
    return this.contractFactory.abracadabraErc20Vault({
      address,
      network: this.network,
    });
  }

  getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>): string[] | Promise<string[]> {
    return Promise.all(
      OPTIMISM_ERC20_VAULT_CAULDRONS.map(({ address: cauldronAddress }) => {
        const cauldron = multicall.wrap(
          this.contractFactory.abracadabraCauldron({
            address: cauldronAddress,
            network: this.network,
          }),
        );

        return cauldron.collateral();
      }),
    );
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<AbracadabraErc20Vault, DefaultAppTokenDefinition>): Promise<
    UnderlyingTokenDefinition[]
  > {
    const underlyingTokenAddress = await contract.underlying();
    return [{ address: underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ multicall, address, appToken }: GetPricePerShareParams<AbracadabraErc20Vault>) {
    const underlying = multicall.wrap(this.contractFactory.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.balanceOf(address);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }

  async getLiquidity({ multicall, address, appToken }: GetDataPropsParams<AbracadabraErc20Vault>) {
    const underlying = multicall.wrap(this.contractFactory.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.balanceOf(address);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ multicall, address, appToken }: GetDataPropsParams<AbracadabraErc20Vault>) {
    const underlying = multicall.wrap(this.contractFactory.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.balanceOf(address);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }
}
