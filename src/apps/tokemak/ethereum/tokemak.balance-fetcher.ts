import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { drillBalance } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Cache } from '~cache/cache.decorator';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { TokemakContractFactory } from '../contracts';
import { TokemakTokeStaking } from '../contracts/ethers/TokemakTokeStaking';
import { TOKEMAK_DEFINITION } from '../tokemak.definition';

type ClaimableDataResponse = {
  payload: {
    wallet: string;
    cycle: number;
    amount: string;
    chainId: number;
  };
};

const network = Network.ETHEREUM_MAINNET;
const rewardContractAddress = '0x79dd22579112d8a5f7347c5ed7e609e60da713c5';
const rewardsHashContractAddress = '0x5ec3EC6A8aC774c7d53665ebc5DDf89145d02fB6';

@Register.BalanceFetcher(TOKEMAK_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumTokemakBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TokemakContractFactory) private readonly tokemakContractFactory: TokemakContractFactory,
  ) {}

  private async getReactorTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: TOKEMAK_DEFINITION.id,
      groupId: TOKEMAK_DEFINITION.groups.reactor.id,
      network,
    });
  }

  private async getFarmBalances(address: string) {
    // @TODO Waiting on TOKE team to reply with how to get earned rewards
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<TokemakTokeStaking>({
      address,
      appId: TOKEMAK_DEFINITION.id,
      groupId: TOKEMAK_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.tokemakContractFactory.tokemakTokeStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: () => 0,
    });
  }

  @Cache({
    key: (address: string) =>
      `studio:${TOKEMAK_DEFINITION.id}:${TOKEMAK_DEFINITION.groups.farm}:${network}:${address}:claimable`,
    ttl: 15 * 60, // 15 min
  })
  async getCycleRewardsHash() {
    const multicall = this.appToolkit.getMulticall(network);
    const rewardsHashContract = this.tokemakContractFactory.tokemakRewardsHash({
      network,
      address: rewardsHashContractAddress,
    });

    const currentCycleIndex = await multicall
      .wrap(rewardsHashContract)
      .latestCycleIndex()
      .catch(() => 0);

    const [latestClaimableRewardsHash, currentCycleRewardsHash] = await multicall
      .wrap(rewardsHashContract)
      .cycleHashes(currentCycleIndex)
      .catch(() => [null, null]);

    return [latestClaimableRewardsHash, currentCycleRewardsHash];
  }

  async getClaimableBalanceData(address: string) {
    const [latestClaimableRewardsHash] = await this.getCycleRewardsHash();
    const url = `https://ipfs.tokemaklabs.xyz/ipfs/${latestClaimableRewardsHash}/${address.toLowerCase()}.json`;
    const data: ClaimableDataResponse['payload'] | null = await Axios.get<ClaimableDataResponse>(url)
      .then(t => t.data.payload)
      .catch(() => null);
    return data;
  }

  async getClaimableBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const payload = await this.getClaimableBalanceData(address);
    if (!payload) return [];

    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const tokeToken = prices.find(p => p.symbol === 'TOKE')!;
    const { chainId, cycle, wallet, amount } = payload;

    const rewardContract = this.tokemakContractFactory.tokemakRewards({ network, address: rewardContractAddress });

    const claimableBalanceRaw = await multicall
      .wrap(rewardContract)
      .getClaimableAmount({ chainId, cycle, wallet, amount })
      .catch(() => 0);

    const claimableTokenBalance = drillBalance(claimable(tokeToken), claimableBalanceRaw.toString());
    const tokens = [claimableTokenBalance];
    const balanceUSD = claimableTokenBalance.balanceUSD;

    // Display Props
    const label = `Claimable ${tokeToken.symbol}`;
    const secondaryLabel = buildDollarDisplayItem(tokeToken.price);
    const images = [getTokenImg(tokeToken.address, network)];

    const positionBalance: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: rewardContractAddress,
      appId: TOKEMAK_DEFINITION.id,
      groupId: TOKEMAK_DEFINITION.groups.farm.id,
      network,
      tokens,
      balanceUSD,

      dataProps: {},
      displayProps: {
        label,
        secondaryLabel,
        images,
      },
    };

    return [positionBalance];
  }

  async getBalances(address: string) {
    const [reactorTokenBalances, farmBalances, claimableBalances] = await Promise.all([
      this.getReactorTokenBalances(address),
      this.getFarmBalances(address),
      this.getClaimableBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Reactors',
        assets: reactorTokenBalances,
      },
      {
        label: 'Staking',
        assets: farmBalances,
      },
      {
        label: 'Claimables',
        assets: claimableBalances,
      },
    ]);
  }
}
