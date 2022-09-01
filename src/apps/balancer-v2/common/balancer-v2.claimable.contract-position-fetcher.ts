import { Inject, NotImplementedException } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { compact, range, sum, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';

import { BalancerMerkleOrchard, BalancerV2ContractFactory } from '../contracts';

import { BalancerV2ClaimableCacheManager } from './balancer-v2.claimable.cache-manager';
import { BALANCER_V2_CLAIMABLE_CONFIG } from './balancer-v2.claimable.config';

export abstract class BalancerV2ClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<BalancerMerkleOrchard> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory) protected readonly contractFactory: BalancerV2ContractFactory,
    @Inject(BalancerV2ClaimableCacheManager) private readonly cacheManager: BalancerV2ClaimableCacheManager,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BalancerMerkleOrchard {
    return this.contractFactory.balancerMerkleOrchard({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<BalancerMerkleOrchard>): Promise<string> {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string) {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(this.network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(this.network);
    const configs = BALANCER_V2_CLAIMABLE_CONFIG.filter(v => v.network === this.network);

    const balances = await Promise.all(
      configs.map(async config => {
        const rewardToken = baseTokens.find(p => p.address === config.rewardTokenAddress);
        if (!rewardToken) return null;

        const amounts = await this.cacheManager.getCachedClaimableAmounts({
          rewardTokenAddress: rewardToken.address,
          address,
          network: this.network,
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
                contractFactory.balancerMerkleOrchard({ network: this.network, address: merkleOrchardAddress }),
              );
              return contract.isClaimed(rewardTokenAddress, distributorAddress, weekNumber, address);
            } else {
              // Use legacy merkle redeem contract
              const { legacyMerkleRedeemAddress } = config;
              if (!legacyMerkleRedeemAddress) return false;
              const contract = multicall.wrap(
                contractFactory.balancerMerkleRedeem({ network: this.network, address: legacyMerkleRedeemAddress }),
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
        const images = [getTokenImg(rewardToken.address, this.network)];
        const statsItems = [];

        const balance: ContractPositionBalance = {
          address: contractPositionAddress,
          type: ContractType.POSITION,
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
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

    return compact(balances);
  }
}
