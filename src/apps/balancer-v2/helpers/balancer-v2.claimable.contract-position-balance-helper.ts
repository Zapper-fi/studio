import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { range, sum, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { BALANCER_V2_CLAIMABLE_CONFIG } from '../balancer-v2.claimables.config';
import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2ContractFactory } from '../contracts';

import { BalancerV2CacheManager } from './balancer-v2.cache-manager';

type BalancerV2ClaimableContractPositionBalanceHelperParams = {
  address: string;
  network: Network;
};

@Injectable()
export class BalancerV2ClaimableContractPositionBalanceHelper {
  constructor(
    @Inject(BalancerV2CacheManager) private readonly balancerV2CacheManager: BalancerV2CacheManager,
    @Inject(BalancerV2ContractFactory) private readonly contractFactory: BalancerV2ContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getContractPositionBalances({ address, network }: BalancerV2ClaimableContractPositionBalanceHelperParams) {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const configs = BALANCER_V2_CLAIMABLE_CONFIG.filter(v => v.network === network);

    const balances = await Promise.all(
      configs.map(async config => {
        const rewardToken = baseTokens.find(p => p.address === config.rewardTokenAddress);
        if (!rewardToken) return null;

        const amounts = await this.balancerV2CacheManager.getCachedClaimableAmounts({
          rewardTokenAddress: config.rewardTokenAddress,
          address,
          network,
        });

        // No cached amounts, no claimable balances
        if (!amounts) return null;

        // Retrieve claimed statuses from on-chain data
        const claimed = await Promise.all(
          range(1, amounts.length + 1).map(weekNumber => {
            if (config.weekStart && weekNumber >= config.weekStart) {
              // Use merkle orchard contract
              const { rewardTokenAddress, distributorAddress, merkleOrchardAddress } = config;
              if (!rewardTokenAddress || !distributorAddress || !merkleOrchardAddress) return false;
              const contract = multicall.wrap(
                contractFactory.balancerMerkleOrchard({ network, address: merkleOrchardAddress }),
              );
              return contract.isClaimed(rewardTokenAddress, distributorAddress, weekNumber, address);
            } else {
              // Use legacy merkle redeem contract
              const { legacyMerkleRedeemAddress } = config;
              if (!legacyMerkleRedeemAddress) return false;
              const contract = multicall.wrap(
                contractFactory.balancerMerkleRedeem({ network, address: legacyMerkleRedeemAddress }),
              );
              return contract.claimed(weekNumber, address);
            }
          }),
        );

        const contractPositionAddress = config.distributorAddress;
        if (!contractPositionAddress) return null;
        const unclaimedAmounts = amounts.filter((_, i) => !claimed[i]);
        const balanceRaw = new BigNumber(sum(unclaimedAmounts)).times(10 ** rewardToken.decimals).toFixed(0);
        const tokens = [drillBalance(claimable(rewardToken), balanceRaw)];
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const label = `Claimable ${rewardToken.symbol}`;
        const secondaryLabel = buildDollarDisplayItem(rewardToken.price);
        const images = [getTokenImg(rewardToken.address, network)];
        const statsItems = [];

        const balance: ContractPositionBalance = {
          address: contractPositionAddress,
          type: ContractType.POSITION,
          appId: BALANCER_V2_DEFINITION.id,
          groupId: BALANCER_V2_DEFINITION.groups.claimable.id,
          network,
          tokens,
          balanceUSD,

          dataProps: {},
          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return balance;
      }),
    );

    return _.compact(balances);
  }
}
