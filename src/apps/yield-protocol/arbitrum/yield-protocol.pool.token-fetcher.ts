import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DisplayProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YieldProtocolContractFactory } from '../contracts';
import { formatMaturity } from '../ethereum/yield-protocol.lend.token-fetcher';
import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;

const YIELD_STRATEGIES = [
  '0xe779cd75e6c574d83d3fd6c92f3cbe31dd32b1e1',
  '0xe7214af14bd70f6aac9c16b0c1ec9ee1ccc7efda',
  '0x92a5b31310a3ed4546e0541197a32101fcfbd5c8',
  '0xdc705fb403dbb93da1d28388bc1dc84274593c11',
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumYieldProtocolPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await Promise.all(
      YIELD_STRATEGIES.map(async address => {
        const strategyContract = this.yieldProtocolContractFactory.strategy({ address, network });

        // strategy data
        const [decimals, symbol, baseAddress, strategyTotalSupply, poolAddress] = await Promise.all([
          multicall.wrap(strategyContract).decimals(),
          multicall.wrap(strategyContract).symbol(),
          multicall.wrap(strategyContract).base(),
          multicall.wrap(strategyContract).totalSupply(),
          multicall.wrap(strategyContract).pool(),
        ]);

        const poolContract = this.yieldProtocolContractFactory.pool({ address: poolAddress, network });

        // pool data
        const [baseReserves, fyTokenReserves, poolTotalSupply, maturity] = await Promise.all([
          multicall.wrap(poolContract).getBaseBalance(),
          multicall.wrap(poolContract).getFYTokenBalance(),
          multicall.wrap(poolContract).totalSupply(),
          multicall.wrap(poolContract).maturity(),
        ]);

        // get the corresponding base of the strategy
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const underlyingToken = baseTokens.find(v => v.address === baseAddress.toLowerCase());

        if (!underlyingToken) return null;

        // estimate the value of a unit of strategy token to base
        const realFyTokenReserves = fyTokenReserves.sub(poolTotalSupply);
        const estimate = (+baseReserves + +realFyTokenReserves) / +strategyTotalSupply;
        const pricePerShare = estimate;
        const price = pricePerShare * underlyingToken.price;

        const displayProps: DisplayProps = {
          label: `Yield ${underlyingToken.symbol} Strategy`,
          secondaryLabel: `Automatic Roll on ${formatMaturity(maturity)}`,
          images: getImagesFromToken(underlyingToken),
        };

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          network,
          symbol,
          decimals,
          supply: +ethers.utils.formatUnits(strategyTotalSupply, decimals),
          pricePerShare,
          price,
          tokens: [underlyingToken],
          dataProps: {},
          displayProps,
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
