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
import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

import { formatMaturity } from './yield-protocol.lend.token-fetcher';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

const YIELD_STRATEGIES = [
  '0x7acfe277ded15caba6a8da2972b1eb93fe1e2ccd',
  '0x1144e14e9b0aa9e181342c7e6e0a9badb4ced295',
  '0xfbc322415cbc532b54749e31979a803009516b5d',
  '0x8e8d6ab093905c400d583efd37fbeeb1ee1c0c39',
  '0xcf30a5a994f9ace5832e30c138c9697cda5e1247',
  '0x831df23f7278575ba0b136296a285600cd75d076',
  '0x47cc34188a2869daa1ce821c8758aa8442715831',
  '0x1565f539e96c4d440c38979dbc86fd711c995dd6',
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumYieldProtocolPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
