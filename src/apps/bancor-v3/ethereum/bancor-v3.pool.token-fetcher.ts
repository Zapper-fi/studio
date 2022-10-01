import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { BancorV3ContractFactory, PoolCollection, PoolToken } from '../contracts';

@PositionTemplate()
export class EthereumBancorV3PoolTokenFetcher extends AppTokenTemplatePositionFetcher<PoolToken> {
  groupLabel = 'Pools';

  bancorAddress = '0xeef417e1d5cc832e619ae18d2f140de2999dd4fb';
  bntPoolAddress = '0x02651e355d26f3506c1e644ba393fdd9ac95eaca';
  bntPoolTokenAddress = '0xab05cf7c6c3a288cd36326e4f7b8600e7268e344';
  bntAddress = '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BancorV3ContractFactory) protected readonly contractFactory: BancorV3ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PoolToken {
    return this.contractFactory.poolToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>) {
    // BNT Pool
    const bntPoolContract = this.contractFactory.bntPool({
      address: this.bntPoolAddress,
      network: this.network,
    });
    const bntPoolTokenAddress = await multicall.wrap(bntPoolContract).poolToken();

    // Other Pools
    const bancorContract = this.contractFactory.bancorNetwork({ address: this.bancorAddress, network: this.network });
    const poolCollectionAddress = (await multicall.wrap(bancorContract).poolCollections()).at(-1)!; // TODO: support multiple pool collections
    const poolContract = this.contractFactory.poolCollection({
      address: poolCollectionAddress,
      network: this.network,
    });
    const pools = await multicall.wrap(bancorContract).liquidityPools();
    const addresses = await Promise.all(pools.map(async pool => multicall.wrap(poolContract).poolToken(pool)));

    return [bntPoolTokenAddress, ...addresses];
  }

  async getUnderlyingTokenAddresses({
    contract,
    address,
  }: GetUnderlyingTokensParams<PoolToken, DefaultAppTokenDefinition>) {
    // BNT Pool
    if (address === this.bntPoolTokenAddress) {
      return this.bntAddress;
    }

    const underlyingTokenAddress = await contract.reserveToken();
    return underlyingTokenAddress.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
  }

  async getPricePerShare({
    multicall,
    appToken,
  }: GetPricePerShareParams<PoolToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    // BNT Pool
    if (appToken.address === this.bntPoolTokenAddress) {
      const bntPoolContract = this.contractFactory.bntPool({
        address: this.bntPoolAddress,
        network: this.network,
      });

      const ratioRaw = await multicall
        .wrap(bntPoolContract)
        .poolTokenToUnderlying((10 ** appToken.tokens[0].decimals).toString());
      return Number(ratioRaw) / 10 ** appToken.tokens[0].decimals;
    }

    const bancorContract = this.contractFactory.bancorNetwork({ address: this.bancorAddress, network: this.network });
    const poolCollectionAddress = (await multicall.wrap(bancorContract).poolCollections()).at(-1)!;
    const poolContract: PoolCollection = this.contractFactory.poolCollection({
      address: poolCollectionAddress,
      network: this.network,
    });

    const poolData = await multicall
      .wrap(poolContract)
      .poolData(appToken.tokens[0].address.replace(ZERO_ADDRESS, ETH_ADDR_ALIAS));
    const reserve = Number(poolData.liquidity.stakedBalance) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }

  getLiquidity({ appToken }: GetDataPropsParams<PoolToken>) {
    return appToken.supply * appToken.price;
  }

  getReserves(_params: GetDataPropsParams<PoolToken>) {
    return [0];
  }

  getApy(_params: GetDataPropsParams<PoolToken>) {
    return 0;
  }
}
