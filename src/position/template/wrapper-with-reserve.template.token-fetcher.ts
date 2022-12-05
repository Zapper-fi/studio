import { Erc20 } from '~contract/contracts';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

import { WrapperTemplateTokenFetcher } from './wrapper.template.token-fetcher';

export abstract class WrapperWithReserveTemplateTokenFetcher extends WrapperTemplateTokenFetcher {
  abstract reserveAddress: string;

  async getLiquidity({ multicall, appToken }: GetDataPropsParams<Erc20>) {
    const underlying = multicall.wrap(this.appToolkit.globalContracts.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.balanceOf(this.reserveAddress ?? this.vaultAddress);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ appToken, multicall }: GetDataPropsParams<Erc20>) {
    const underlying = multicall.wrap(this.appToolkit.globalContracts.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.balanceOf(this.reserveAddress);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }
}
