import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc4626 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types';

import { PoolTogetherV5ContractFactory } from '../contracts';

export const PRIZE_VAULT_FACTORY_ADDRESSES: Partial<Record<Network, string>> = {
  [Network.OPTIMISM_MAINNET]: '0xf65fa202907d6046d1ef33c521889b54bde08081',
};

export abstract class PoolTogetherV5PrizeVaultTokenFetcher extends AppTokenTemplatePositionFetcher<Erc4626> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV5ContractFactory) private readonly contractFactory: PoolTogetherV5ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc4626 {
    return this.appToolkit.globalContracts.erc4626({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(def => def.address);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<DefaultAppTokenDefinition[]> {
    const vaultFactoryAddress = PRIZE_VAULT_FACTORY_ADDRESSES[this.network]!;

    const vaultFactoryContract = this.contractFactory.poolTogetherV5VaultFactory({
      address: vaultFactoryAddress,
      network: this.network,
    });
    const vaultNumberRaw = await multicall.wrap(vaultFactoryContract).totalVaults();

    return Promise.all(
      range(0, vaultNumberRaw.toNumber()).map(async index => {
        const address = await multicall.wrap(vaultFactoryContract).allVaults(index);
        return {
          address,
        };
      }),
    );
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<Erc4626>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<Erc4626>) {
    const ratioRaw = await contract.convertToAssets(BigNumber.from((10 ** appToken.decimals).toString()));
    const ratio = Number(ratioRaw) / 10 ** appToken.decimals;
    return [ratio];
  }

  async getLiquidity({ contract, appToken }: GetDataPropsParams<Erc4626>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ contract, appToken }: GetDataPropsParams<Erc4626>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }

  async getLabel({ contract }: GetDisplayPropsParams<Erc4626>) {
    return contract.name();
  }

  async getLabelDetailed({ appToken }: GetDisplayPropsParams<Erc4626>) {
    return appToken.symbol;
  }
}
