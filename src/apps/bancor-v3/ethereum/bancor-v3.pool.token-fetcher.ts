import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  DefaultAppTokenDataProps,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { BancorV3ContractFactory, PoolCollection, PoolToken } from '../contracts';

@PositionTemplate()
export class EthereumBancorV3PoolTokenFetcher extends AppTokenTemplatePositionFetcher<PoolToken> {
  groupLabel = 'Pools';

  bancorAddress = '0xeef417e1d5cc832e619ae18d2f140de2999dd4fb';

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
    const bancorContract = this.contractFactory.bancorNetwork({ address: this.bancorAddress, network: this.network });
    const poolCollectionAddress = (await multicall.wrap(bancorContract).poolCollections()).at(-1)!; // TODO: support multiple pool collections
    const poolContract = this.contractFactory.poolCollection({
      address: poolCollectionAddress,
      network: this.network,
    });

    const pools = await multicall.wrap(bancorContract).liquidityPools();
    const addresses = await Promise.all(pools.map(async pool => multicall.wrap(poolContract).poolToken(pool)));
    return addresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<PoolToken, DefaultAppTokenDefinition>) {
    const underlyingTokenAddressRaw = await contract.reserveToken();
    const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
    return [{ address: underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({
    multicall,
    appToken,
  }: GetPricePerShareParams<PoolToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    if (appToken.supply === 0) return [0];

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
    const pricePerShare = reserve / appToken.supply;

    return [pricePerShare];
  }
}
