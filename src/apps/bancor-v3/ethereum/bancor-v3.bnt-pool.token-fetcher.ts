import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { BancorV3ContractFactory, PoolToken } from '../contracts';

@PositionTemplate()
export class EthereumBancorV3BntPoolTokenFetcher extends AppTokenTemplatePositionFetcher<PoolToken> {
  groupLabel = 'Pools';

  bntPoolAddress = '0x02651e355d26f3506c1e644ba393fdd9ac95eaca';
  bntPoolTokenAddress = '0xab05cf7c6c3a288cd36326e4f7b8600e7268e344';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BancorV3ContractFactory) protected readonly contractFactory: BancorV3ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PoolToken {
    return this.contractFactory.poolToken({ address, network: this.network });
  }

  async getAddresses() {
    return [this.bntPoolTokenAddress];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<PoolToken, DefaultAppTokenDefinition>) {
    const underlyingTokenAddress = await contract.reserveToken();
    return underlyingTokenAddress.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
  }

  async getPricePerShare({
    multicall,
    appToken,
  }: GetPricePerShareParams<PoolToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    const bntPoolContract = this.contractFactory.bntPool({
      address: this.bntPoolAddress,
      network: this.network,
    });

    const ratioRaw = await multicall
      .wrap(bntPoolContract)
      .poolTokenToUnderlying((10 ** appToken.tokens[0].decimals).toString());
    return Number(ratioRaw) / 10 ** appToken.tokens[0].decimals;
  }

  getLiquidity({ appToken }: GetDataPropsParams<PoolToken>) {
    return appToken.supply * appToken.price;
  }

  getReserves({ appToken }: GetDataPropsParams<PoolToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  getApy(_params: GetDataPropsParams<PoolToken>) {
    return 0;
  }
}
