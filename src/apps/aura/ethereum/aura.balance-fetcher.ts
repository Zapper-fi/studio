import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isSupplied, isLocked } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { AURA_DEFINITION } from '../aura.definition';
import { AuraBaseRewardPoolDataProps } from '../aura.types';
import { AuraContractFactory, AuraMasterchef, AuraVirtualBalanceRewardPool } from '../contracts';
import { AuraBaseRewardPoolHelper } from '../helpers/aura.base-reward-pool-helper';

const appId = AURA_DEFINITION.id;
const groups = AURA_DEFINITION.groups;
const network = Network.ETHEREUM_MAINNET;

type GetBaseRewardPoolBalancesParams = {
  address: string;
  groupId: string;
};

@Register.BalanceFetcher(appId, network)
export class EthereumAuraBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly auraContractFactory: AuraContractFactory,
    @Inject(AuraBaseRewardPoolHelper) private readonly auraBaseRewardPoolHelper: AuraBaseRewardPoolHelper,
  ) {}

  async getBaseRewardPoolBalances({ address, groupId }: GetBaseRewardPoolBalancesParams) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances<AuraBaseRewardPoolDataProps>(
      {
        appId,
        groupId,
        network,
        address,
        resolveBalances: async ({ address, contractPosition, multicall }) => {
          const stakedToken = contractPosition.tokens.find(isSupplied);
          const claimableTokens = contractPosition.tokens.filter(isClaimable);

          const rewardToken = claimableTokens.find(
            ({ address }) => address.toLowerCase() === contractPosition.dataProps.rewardToken.toLowerCase(),
          );
          const auraToken = claimableTokens.find(
            ({ address }) => address.toLowerCase() === AURA_DEFINITION.token!.address,
          );
          const extraRewardTokens = compact(
            claimableTokens.filter(({ address }) =>
              contractPosition.dataProps.extraRewards.find(
                extraReward => extraReward.rewardToken.toLowerCase() === address.toLowerCase(),
              ),
            ),
          );

          const baseRewardPool = this.auraContractFactory.baseRewardPool(contractPosition);

          const extraRewardPools: AuraVirtualBalanceRewardPool[] = contractPosition.dataProps.extraRewards
            .filter(({ rewardToken }) =>
              extraRewardTokens.find(token => token.address.toLowerCase() === rewardToken.toLowerCase()),
            )
            .map(({ address }) => this.auraContractFactory.auraVirtualBalanceRewardPool({ address, network }));

          const [stakedBalanceRaw, rewardBalanceRaw, ...extraRewardBalancesRaw] = await Promise.all([
            multicall.wrap(baseRewardPool).balanceOf(address),
            multicall.wrap(baseRewardPool).earned(address),
            ...extraRewardPools.map(virtualBalanceRewardPool =>
              multicall.wrap(virtualBalanceRewardPool).earned(address),
            ),
          ]);

          const auraRewardBalanceRaw = await this.auraBaseRewardPoolHelper.getAuraMintedForRewardToken({
            rewardTokenAmount: rewardBalanceRaw,
            network,
          });

          return compact([
            stakedToken ? drillBalance(stakedToken, stakedBalanceRaw.toString()) : null,
            rewardToken ? drillBalance(rewardToken, rewardBalanceRaw.toString()) : null,
            auraToken ? drillBalance(auraToken, auraRewardBalanceRaw.toString()) : null,
            ...extraRewardBalancesRaw.map((balanceRaw, index) => {
              const extraRewardToken = extraRewardTokens[index];
              return extraRewardToken ? drillBalance(extraRewardToken, balanceRaw.toString()) : null;
            }),
          ]);
        },
      },
    );
  }

  async getChefBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<AuraMasterchef>({
      appId,
      groupId: groups.chef.id,
      network,
      address,
      resolveChefContract: ({ contractAddress, network }) =>
        this.auraContractFactory.auraMasterchef({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: async ({ contract, contractPosition, multicall, address }) => {
          const provider = this.appToolkit.getNetworkProvider(network);
          const block = await provider.getBlockNumber();

          const { poolIndex } = contractPosition.dataProps;
          const [poolInfo, userInfo, totalAllocPoint, rewardPerBlock, endBlock] = await Promise.all([
            multicall.wrap(contract).poolInfo(poolIndex),
            multicall.wrap(contract).userInfo(poolIndex, address),
            multicall.wrap(contract).totalAllocPoint(),
            multicall.wrap(contract).rewardPerBlock(),
            multicall.wrap(contract).endBlock(),
          ]);

          if (userInfo.amount.eq(0)) {
            return 0;
          }

          const lpToken = this.appToolkit.globalContracts.erc20({ address: poolInfo.lpToken, network });
          const lpSupply = await lpToken.balanceOf(contract.address);

          let { accCvxPerShare } = poolInfo;
          if (poolInfo.lastRewardBlock.lt(block) && lpSupply.gt(0)) {
            const clampedTo = Math.min(block, Number(endBlock));
            const clampedFrom = Math.min(Number(poolInfo.lastRewardBlock), Number(endBlock));
            const multiplier = BigNumber.from(clampedTo - clampedFrom);
            const reward = multiplier.mul(rewardPerBlock).mul(poolInfo.allocPoint).div(totalAllocPoint);
            accCvxPerShare = accCvxPerShare.add(reward.mul(10 ** 12).div(lpSupply));
          }

          return userInfo.amount
            .mul(accCvxPerShare)
            .div(10 ** 12)
            .sub(userInfo.rewardDebt);
        },
      }),
    });
  }

  async getLockerBalances(address: string) {
    const auraLockerAddress = '0x3fa73f1e5d8a792c80f426fc8f84fbf7ce9bbcac';

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      network,
      appId,
      address,
      groupId: groups.locker.id,
      resolveBalances: async ({ address, contractPosition, multicall, network }) => {
        const auraLocker = this.auraContractFactory.auraLocker({
          address: auraLockerAddress,
          network,
        });

        const [lockedBalances, claimableRewards] = await Promise.all([
          multicall.wrap(auraLocker).lockedBalances(address),
          multicall.wrap(auraLocker).claimableRewards(address),
        ]);

        const { unlockable, locked } = lockedBalances;

        const lockedToken = contractPosition.tokens.find(isLocked);
        const suppliedToken = contractPosition.tokens.find(isSupplied); // Same as locked (ie AURA), but unlocked
        const claimableTokens = contractPosition.tokens.filter(isClaimable);

        return compact([
          lockedToken ? drillBalance(lockedToken, locked.toString()) : null,
          suppliedToken ? drillBalance(suppliedToken, unlockable.toString()) : null,
          ...claimableRewards.map(({ token, amount }) => {
            const claimableToken = claimableTokens.find(t => t.address.toLowerCase() === token.toLowerCase());
            return claimableToken ? drillBalance(claimableToken, amount.toString()) : null;
          }),
        ]);
      },
    });
  }

  private async getStakingBalances(address: string) {
    return this.getBaseRewardPoolBalances({ address, groupId: groups.staking.id });
  }

  private async getPoolsBalances(address: string) {
    return this.getBaseRewardPoolBalances({ address, groupId: groups.pools.id });
  }

  async getBalances(address: string) {
    const groupBalances = await Promise.all([
      this.getLockerBalances(address),
      this.getChefBalances(address),
      this.getStakingBalances(address),
      this.getPoolsBalances(address),
    ]);

    return presentBalanceFetcherResponse(
      groupBalances
        .filter(assets => assets.length > 0)
        .map(assets => ({
          assets,
          label: groups[assets[0].groupId].label,
        })),
    );
  }
}
