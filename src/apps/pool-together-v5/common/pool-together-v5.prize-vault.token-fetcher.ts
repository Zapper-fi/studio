import { Erc20, Erc4626 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetDisplayPropsParams, GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';
import { PRIZE_VAULT_ADDRESSES } from './pool-together.v5.constants';

export abstract class PoolTogetherV5PrizeVaultTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel: string;

  getContract(address: string): Erc4626 {
    return this.appToolkit.globalContracts.erc4626({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return PRIZE_VAULT_ADDRESSES[this.network] ?? [];
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
