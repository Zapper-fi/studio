import { Inject } from '@nestjs/common';
import { parseEther } from 'ethers/lib/utils';
import { gql } from 'graphql-request';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SpoolContractFactory } from '~apps/spool';
import { STAKING_ADDRESS, SUBGRAPH_API_BASE_URL, VOSPOOL_ADDRESS } from '~apps/spool/ethereum/spool.constants';
import { ResolveBalancesProps, UserSpoolStaking } from '~apps/spool/ethereum/spool.types';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isSupplied, isVesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SPOOL_DEFINITION } from '../spool.definition';

const network = Network.ETHEREUM_MAINNET;

const spoolStakedQuery = gql`
  query getStaking($address: String!) {
    userSpoolStaking(id: $address) {
      id
      spoolStaked
    }
  }
`;

@Register.BalanceFetcher(SPOOL_DEFINITION.id, network)
export class EthereumSpoolBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Inject(SpoolContractFactory)
  private readonly spoolContractFactory: SpoolContractFactory;

  async getBalances(address: string) {
    const vaultBalances = await this.getVaultBalances(address);
    const stakingBalances = await this.getStakingBalances(address);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultBalances,
      },
      {
        label: 'Staking',
        assets: stakingBalances,
      },
    ]);
  }

  async getVaultBalances(address: string) {
    return await this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SPOOL_DEFINITION.id,
      groupId: SPOOL_DEFINITION.groups.vault.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async (props: ResolveBalancesProps) => {
        const { address, contractPosition, multicall } = props;

        const suppliedToken = contractPosition.tokens.find(isSupplied)!;
        const contract = this.spoolContractFactory.spoolVault(contractPosition);
        const strategies = contractPosition.dataProps.strategies;

        const [balanceRaw] = await Promise.all([
          multicall.wrap(contract).callStatic.getUpdatedUser(strategies, { from: address }),
        ]);

        // balanceRaw[5] + balanceRaw[7]: pending deposits
        // balanceRaw[4]: user's funds in underlying asset
        const pendingDeposit = balanceRaw[5].add(balanceRaw[7]);
        const balance = balanceRaw[4].add(pendingDeposit);
        return [drillBalance(suppliedToken, balance.toString())];
      },
    });
  }

  /**
   * Fetch staked amount, generated voting power and claimable rewards
   * - SpoolStaking can emit arbitrary tokens
   * - VoSpoolRewards emits SPOOL
   * - VoSPOOL is gradually unlocked over X weeks, reset to 0 if un-staked
   * @param address
   */
  async getStakingBalances(address: string) {
    return await this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SPOOL_DEFINITION.id,
      groupId: SPOOL_DEFINITION.groups.staking.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const graphHelper = this.appToolkit.helpers.theGraphHelper;
        const staking = this.spoolContractFactory.spoolStaking({ network, address: STAKING_ADDRESS });

        const suppliedToken = contractPosition.tokens.find(isSupplied)!;
        const govToken = contractPosition.tokens.find(isVesting)!;
        const rewardTokens = contractPosition.tokens.filter(isClaimable);

        const voSpool = this.spoolContractFactory.spoolVospool({ network, address: VOSPOOL_ADDRESS });
        const [votingPowerRaw, voSpoolRewards, ...tokenRewards] = await Promise.all([
          multicall.wrap(voSpool).getUserGradualVotingPower(address),
          multicall.wrap(staking).callStatic.getUpdatedVoSpoolRewardAmount({ from: address }),
          ...rewardTokens.map(reward => multicall.wrap(staking).earned(reward.address, address)),
        ]);

        const stakedSpool = await graphHelper.requestGraph<UserSpoolStaking>({
          endpoint: SUBGRAPH_API_BASE_URL,
          query: spoolStakedQuery,
          variables: { address },
        });

        const stakedAmount = parseEther(stakedSpool?.userSpoolStaking?.spoolStaked || '0').toString();

        const rewardBalances = rewardTokens.map((token, idx) => {
          // Add voSPOOL rewards (always in SPOOL)
          const rewards =
            token.address.toLowerCase() == suppliedToken.address.toLowerCase()
              ? tokenRewards[idx].add(voSpoolRewards)
              : tokenRewards[idx];

          return drillBalance(token, rewards.toString());
        });

        return [
          drillBalance(suppliedToken, stakedAmount),
          drillBalance(govToken, votingPowerRaw.toString()),
          ...rewardBalances,
        ];
      },
    });
  }
}
