import { Inject } from '@nestjs/common';

import { Erc4626 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { DefaultAppTokenDefinition, GetAddressesParams, GetDataPropsParams, GetDefinitionsParams, GetDisplayPropsParams, GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';
import { PRIZE_VAULT_FACTORY_ADDRESSES } from './pool-together.v5.constants';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PoolTogetherV5ContractFactory } from '../contracts';

export abstract class PoolTogetherV5PrizeVaultTokenFetcher extends AppTokenTemplatePositionFetcher<Erc4626> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV5ContractFactory) private readonly contractFactory: PoolTogetherV5ContractFactory
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc4626 {
    return this.appToolkit.globalContracts.erc4626({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(def => def.address);
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<DefaultAppTokenDefinition[]> {
    const { multicall } = params;

    const vaultFactoryAddress = PRIZE_VAULT_FACTORY_ADDRESSES[this.network];
    
    if(!!vaultFactoryAddress) {
      const vaultFactory = multicall.wrap(
        this.contractFactory.poolTogetherV5VaultFactory(
          { network: this.network, address: vaultFactoryAddress }
        )
      );

      const totalVaults = Number(await vaultFactory.totalVaults());
      const vaultIndexes = [...Array(totalVaults).keys()];

      const vaultAddresses = await Promise.all(vaultIndexes.map(index => vaultFactory.allVaults(index)));

      return vaultAddresses.map(address => ({ address }));
    } else {
      return []
    }
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<Erc4626>) {
    const underlyingToken = await contract.asset();
    return [{ address: underlyingToken, network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<Erc4626>) {
    const oneShare = BigInt(10 ** appToken.tokens[0].decimals);
    const exchangeRate = (await contract.convertToAssets(oneShare)).toBigInt();
    const pricePerShare = Number(exchangeRate / oneShare);
    return [pricePerShare];
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
