import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BastionProtocolContractFactory } from '../contracts';

export type BastionProtocolPoolTokenDefinition = {
  address: string;
  swapAddress: string;
};

@PositionTemplate()
export class AuroraBastionProtocolPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  DefaultAppTokenDataProps,
  BastionProtocolPoolTokenDefinition
> {
  groupLabel = 'Pools';

  poolDefinitions = [
    {
      swapAddress: '0x6287e912a9ccd4d5874ae15d3c89556b2a05f080',
      tokenAddress: '0x0039f0641156cac478b0debab086d78b66a69a01',
    },
  ];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BastionProtocolContractFactory) protected readonly contractFactory: BastionProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getDefinitions() {
    return this.poolDefinitions.map(v => ({
      address: v.tokenAddress,
      swapAddress: v.swapAddress,
    }));
  }

  async getAddresses({ definitions }: GetAddressesParams<BastionProtocolPoolTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<Erc20, BastionProtocolPoolTokenDefinition>) {
    const swapContract = this.contractFactory.bastionProtocolSwap({
      address: definition.swapAddress,
      network: this.network,
    });

    return [
      { address: await multicall.wrap(swapContract).getToken(0), network: this.network },
      { address: await multicall.wrap(swapContract).getToken(1), network: this.network },
    ];
  }

  async getPricePerShare({
    definition,
    multicall,
    appToken,
  }: GetPricePerShareParams<Erc20, DefaultAppTokenDataProps, BastionProtocolPoolTokenDefinition>) {
    if (appToken.supply === 0) return 0;
    const swapContract = this.contractFactory.bastionProtocolSwap({
      address: definition.swapAddress,
      network: this.network,
    });

    const [reserveRaw0, reserveRaw1] = await Promise.all([
      multicall.wrap(swapContract).getTokenBalance(0),
      multicall.wrap(swapContract).getTokenBalance(1),
    ]);

    const reserves = [reserveRaw0, reserveRaw1].map((v, i) => Number(v) / 10 ** appToken.tokens[i].decimals);
    return reserves.map(v => v / appToken.supply);
  }

  async getLiquidity({ appToken }: GetDataPropsParams<Erc20>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<Erc20>) {
    return (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
  }

  async getApy(_params: GetDataPropsParams<Erc20>) {
    return 0;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Erc20>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }
}
