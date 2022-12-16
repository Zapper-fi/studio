// import { Inject } from '@nestjs/common';
// import { ethers } from 'ethers';
// import { compact } from 'lodash';

// import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
// import { Register } from '~app-toolkit/decorators';
// import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
// import { ContractType } from '~position/contract.interface';
// import { DisplayProps } from '~position/display.interface';
// import { PositionFetcher } from '~position/position-fetcher.interface';
// import { AppTokenPosition } from '~position/position.interface';
// import { Network } from '~types/network.interface';

// import { YieldProtocolContractFactory } from '../contracts';
// import { formatMaturity } from '../ethereum/yield-protocol.lend.token-fetcher';
// import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

// const appId = YIELD_PROTOCOL_DEFINITION.id;
// const groupId = YIELD_PROTOCOL_DEFINITION.groups.pool.id;
// const network = Network.ARBITRUM_MAINNET;

// const YIELD_STRATEGIES = [
//   '0xe779cd75e6c574d83d3fd6c92f3cbe31dd32b1e1',
//   '0x92a5b31310a3ed4546e0541197a32101fcfbd5c8',
//   '0xd5b43b2550751d372025d048553352ac60f27151',
//   '0xa3caf61fd23d374ce13c742e4e9fa9fac23ddae6',
//   '0x54f08092e3256131954dd57c04647de8b2e7a9a9',
//   '0x3353e1e2976dbbc191a739871faa8e6e9d2622c7',
// ];

// @Register.TokenPositionFetcher({ appId, groupId, network })
// export class ArbitrumYieldProtocolPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
//   constructor(
//     @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
//     @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
//   ) {}

//   async getPositions() {
//     const multicall = this.appToolkit.getMulticall(network);

//     const tokens = await Promise.all(
//       YIELD_STRATEGIES.map(async address => {
//         const strategyContract = this.yieldProtocolContractFactory.strategy({ address, network });

//         // strategy data
//         const [decimals, symbol, baseAddress, strategyTotalSupply, poolAddress] = await Promise.all([
//           multicall.wrap(strategyContract).decimals(),
//           multicall.wrap(strategyContract).symbol(),
//           multicall.wrap(strategyContract).base(),
//           multicall.wrap(strategyContract).totalSupply(),
//           multicall.wrap(strategyContract).pool(),
//         ]);

//         const poolContract = this.yieldProtocolContractFactory.pool({ address: poolAddress, network });

//         // pool data
//         const [baseReserves, fyTokenReserves, poolTotalSupply, maturity] = await Promise.all([
//           multicall.wrap(poolContract).getBaseBalance(),
//           multicall.wrap(poolContract).getFYTokenBalance(),
//           multicall.wrap(poolContract).totalSupply(),
//           multicall.wrap(poolContract).maturity(),
//         ]);

//         // get the corresponding base of the strategy
//         const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
//         const underlyingToken = baseTokens.find(v => v.address === baseAddress.toLowerCase());

//         if (!underlyingToken) return null;

//         // estimate the value of a unit of strategy token to base
//         const realFyTokenReserves = fyTokenReserves.sub(poolTotalSupply);
//         const estimate = (+baseReserves + +realFyTokenReserves) / +strategyTotalSupply;
//         const pricePerShare = estimate;
//         const price = pricePerShare * underlyingToken.price;

//         const displayProps: DisplayProps = {
//           label: `Yield ${underlyingToken.symbol} Strategy`,
//           secondaryLabel: `Automatic Roll on ${formatMaturity(maturity)}`,
//           images: getImagesFromToken(underlyingToken),
//         };

//         const token: AppTokenPosition = {
//           type: ContractType.APP_TOKEN,
//           appId,
//           groupId,
//           address,
//           network,
//           symbol,
//           decimals,
//           supply: +ethers.utils.formatUnits(strategyTotalSupply, decimals),
//           pricePerShare,
//           price,
//           tokens: [underlyingToken],
//           dataProps: {},
//           displayProps,
//         };

//         return token;
//       }),
//     );

//     return compact(tokens);
//   }
// }

import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { YieldProtocolContractFactory, YieldProtocolPoolToken } from '../contracts';

import { formatMaturity } from './yield-protocol.lend.token-fetcher';

export type YieldProtocolPoolTokenDataProps = {
  liquidity: number;
  reserves: number[];
  apy: number;
  maturity: number;
};

export abstract class YieldProtocolPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  YieldProtocolPoolToken,
  YieldProtocolPoolTokenDataProps
> {
  abstract poolTokenAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) protected readonly contractFactory: YieldProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YieldProtocolPoolToken {
    return this.contractFactory.yieldProtocolPoolToken({ address, network: this.network });
  }

  async getAddresses() {
    return this.poolTokenAddresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<YieldProtocolPoolToken>) {
    return [await contract.base()];
  }

  async getPricePerShare({ appToken, contract, multicall }: GetPricePerShareParams<YieldProtocolPoolToken>) {
    const poolAddress = await contract.pool();
    const poolContract = this.contractFactory.yieldProtocolPool({ address: poolAddress, network: this.network });

    const [baseReserves, fyTokenReserves, poolTotalSupply] = await Promise.all([
      multicall.wrap(poolContract).getBaseBalance(),
      multicall.wrap(poolContract).getFYTokenBalance(),
      multicall.wrap(poolContract).totalSupply(),
    ]);

    const realFyTokenReserves = fyTokenReserves.sub(poolTotalSupply);
    const reserveRaw = baseReserves.add(realFyTokenReserves);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<YieldProtocolPoolToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<YieldProtocolPoolToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<YieldProtocolPoolToken>) {
    return 0;
  }

  async getDataProps(params: GetDataPropsParams<YieldProtocolPoolToken>) {
    const defaultDataProps = await super.getDataProps(params);

    const { contract, multicall } = params;
    const poolAddress = await contract.pool();
    const poolContract = this.contractFactory.yieldProtocolPool({ address: poolAddress, network: this.network });
    const maturity = await multicall.wrap(poolContract).maturity();

    return { ...defaultDataProps, maturity: Number(maturity) };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<YieldProtocolPoolToken>) {
    return `Yield ${getLabelFromToken(appToken.tokens[0])} Strategy`;
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<YieldProtocolPoolToken, YieldProtocolPoolTokenDataProps>) {
    return `Automatic Roll on ${formatMaturity(appToken.dataProps.maturity)}`;
  }
}
