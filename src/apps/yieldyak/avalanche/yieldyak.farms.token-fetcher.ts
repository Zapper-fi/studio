import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { BigNumber } from 'ethers';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { TRADER_JOE_DEFINITION } from '~apps/trader-joe';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YieldyakContractFactory } from '../contracts';
import { YIELDYAK_DEFINITION } from '../yieldyak.definition';

const appId = YIELDYAK_DEFINITION.id;
const groupId = YIELDYAK_DEFINITION.groups.farms.id;
const network = Network.AVALANCHE_MAINNET;

export type YieldYakFarmDetails = {
  address: string;
  deployed: number;
  name: string;
  depositToken: {
    address: string;
    symbol: string;
  };
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheYieldyakFarmsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldyakContractFactory) private readonly yieldyakContractFactory: YieldyakContractFactory,
  ) {}

  async getPositions() {
    const farms = await Axios.get<YieldYakFarmDetails[]>('https://staging-api.yieldyak.com/farms').then(x => x.data);
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    const appTokenDependencies = await this.appToolkit.getAppTokenPositions(
      { appId: TRADER_JOE_DEFINITION.id, groupIds: [TRADER_JOE_DEFINITION.groups.pool.id], network },
      { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
      { appId: 'pangolin', groupIds: ['pool'], network },
      { appId: 'benqi', groupIds: ['s-avax'], network },
      { appId: 'gmx', groupIds: [], network },
      { appId: 'lydia', groupIds: ['pool'], network },
      { appId: 'stargate', groupIds: ['pool'], network },
    );

    const allTokenDependencies = [...baseTokenDependencies, ...appTokenDependencies];

    const tokens = await Promise.all(
      farms.map(async farm => {
        const farmAddress = farm.address;
        const underlyingTokenAddress = farm.depositToken.address;
        const contract = this.yieldyakContractFactory.yakStrategyV2({
          address: farmAddress,
          network,
        });

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        const underlyingToken = allTokenDependencies.find(
          x => x.address.toLowerCase() === underlyingTokenAddress.toLowerCase(),
        );

        if (!underlyingToken) {
          // console.log('unknown', underlyingTokenAddress, farm.depositToken.symbol, farmAddress);
          return null;
        }

        let underlyingPerShare: BigNumber;
        try {
          [underlyingPerShare] = await Promise.all([
            multicall.wrap(contract).getDepositTokensForShares(BigNumber.from(10).pow(decimals)),
          ]);
        } catch (ex) {
          // console.log(ex);
          return null;
        }
        const pricePerShare = Number(underlyingPerShare) / 10 ** decimals;
        const price = pricePerShare * underlyingToken?.price;

        const supply = Number(supplyRaw) / 10 ** decimals;

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: farmAddress,
          network,
          symbol,
          decimals,
          supply,
          pricePerShare,
          price,
          tokens: [underlyingToken!],
          dataProps: {},
          displayProps: { label: '', images: [] },
        };

        return token;
      }),
    );

    return _.compact(tokens);
  }
}
