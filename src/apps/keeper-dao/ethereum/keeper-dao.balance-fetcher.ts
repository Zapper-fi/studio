import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { zip } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { KeeperDaoContractFactory } from '../contracts';
import { KEEPER_DAO_DEFINITION } from '../keeper-dao.definition';

type RewardOfLiquidityProviderResponse = {
  owner: string;
  earnings_to_date: string;
  nonce: string;
  signature: string;
};

const rewardPrograms = [
  {
    name: 'LP-PRE',
    url: `https://indibo-lp-pre.herokuapp.com/reward_of_liquidity_provider`,
    contractAddress: '0xaef38e99b9db5e96cab3ce5cbc29a3a1dfeffe71',
  },
  {
    name: 'LP',
    url: `https://indibo-lp.herokuapp.com/reward_of_liquidity_provider`,
    contractAddress: '0xcadf6735144d1d7f1a875a5561555cba5df2f75c',
  },
  {
    name: 'LP-Q2',
    url: `https://indibo-lpq2.herokuapp.com/reward_of_liquidity_provider`,
    contractAddress: '0x2777b798fdfb906d42b89cf8f9de541db05dd6a1',
  },
  {
    name: 'LP-KEEPER',
    url: `https://indibo-keeper.herokuapp.com/reward_of_keeper`,
    contractAddress: '0xf55a73a366f1f9f03cef4cc10d3cd21e5c6a9026',
  },
  {
    name: 'LP-HIDING-GAME',
    url: `https://indibo-hiding.herokuapp.com/reward_of_hiding_game`,
    contractAddress: '0xd81e97075dbda444ef65db3a96706c679b5311fd',
  },
];

const name = KEEPER_DAO_DEFINITION.name;
const appId = KEEPER_DAO_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;
const KEEPER_DAO_TOKEN_ADDRESS = '0xfa5047c9c78b8877af97bdcb85db743fd7313d4a';

@Register.BalanceFetcher(appId, network)
export class EthereumKeeperDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(KeeperDaoContractFactory) private readonly contractFactory: KeeperDaoContractFactory,
  ) {}

  private getV2PoolBalances(address: string) {
    // v2 & v3 pool have a similar interface, we can reuse the same contract for both.
    const contract = this.contractFactory.keeperDaoLiquidityPoolV2({
      network,
      address: '0x35ffd6e268610e764ff6944d07760d0efe5e40e5',
    });

    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId,
      network,
      groupId: KEEPER_DAO_DEFINITION.groups.v2Pool.id,
      address,
      resolveBalance: ({ multicall, token }) =>
        multicall
          .wrap(contract)
          .underlyingBalance(token.tokens[0].address, address)
          .then(v => v.toString()),
    });
  }

  private getV3PoolBalances(address: string) {
    // v2 & v3 pool have a similar interface, we can reuse the same contract for both.
    const contract = this.contractFactory.keeperDaoLiquidityPoolV2({
      network,
      address: '0x4f868c1aa37fcf307ab38d215382e88fca6275e2',
    });

    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId,
      network,
      groupId: KEEPER_DAO_DEFINITION.groups.v3Pool.id,
      address,
      resolveBalance: ({ multicall, token }) =>
        multicall
          .wrap(contract)
          .underlyingBalance(token.tokens[0].address, address)
          .then(v => v.toString()),
    });
  }

  private async getClaimableBalances(address: string) {
    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const multicall = this.appToolkit.getMulticall(network);

    try {
      const earnedPerProgram = await Promise.all(
        rewardPrograms.map(program =>
          Axios.get<RewardOfLiquidityProviderResponse>(`${program.url}/${address}`).then(
            ({ data }) => data.earnings_to_date,
          ),
        ),
      );

      const claimedPerProgram = await Promise.all(
        rewardPrograms.map(program => {
          const distributorContract = this.contractFactory.keeperDaoLiquidityPoolDistributor({
            network,
            address: program.contractAddress,
          });
          return multicall.wrap(distributorContract).claimedAmount(address);
        }),
      );

      const rookToken = prices.find(t => t.address === KEEPER_DAO_TOKEN_ADDRESS);

      return zip(rewardPrograms, earnedPerProgram, claimedPerProgram)
        .map(([program, earnedRaw, claimedRaw]) => {
          if (!earnedRaw || !claimedRaw || !rookToken || !program) {
            return null;
          }

          const earned = new BigNumber(earnedRaw, 16);
          const claimed = new BigNumber(claimedRaw.toString());
          const claimableBalanceRaw = earned.minus(claimed).toString();

          const tokens = [drillBalance(rookToken, claimableBalanceRaw)];

          const position: ContractPositionBalance = {
            type: ContractType.POSITION,
            appId,
            groupId: KEEPER_DAO_DEFINITION.groups.farm.id,
            network,
            address: program.contractAddress,
            tokens,
            dataProps: {},
            displayProps: {
              label: `Claimable ${tokens[0].symbol}`,
              secondaryLabel: buildDollarDisplayItem(tokens[0].price),
              images: [getTokenImg(tokens[0].address, network)],
            },
            balanceUSD: tokens[0].balanceUSD,
          };

          return position;
        })
        .filter((p): p is ContractPositionBalance<DefaultDataProps> => !!p);
    } catch (err) {
      return [];
    }
  }

  async getBalances(address: string) {
    const assets = await Promise.all([
      this.getV2PoolBalances(address),
      this.getV3PoolBalances(address),
      this.getClaimableBalances(address),
    ]).then(v => v.flat());

    return presentBalanceFetcherResponse([
      {
        label: name,
        assets,
      },
    ]);
  }
}
