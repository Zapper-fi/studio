import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { SpoolContractFactory } from '~apps/spool';
import { ANALYTICS_API_BASE_URL, SUBGRAPH_API_BASE_URL } from '~apps/spool/ethereum/spool.constants';
import { ContractType } from '~position/contract.interface';
import { WithMetaType } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition, Token } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { SPOOL_DEFINITION } from '../spool.definition';

import { Platform, RewardAnalytics, VaultDetails, SpoolVaults, StrategyAnalytics, VaultAnalytics } from './spool.types';

const appId = SPOOL_DEFINITION.id;
const groupId = SPOOL_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

const platformQuery = gql`
  query {
    platform(id: "platform") {
      id
      treasuryFeeSize
      ecosystemFeeSize
    }
  }
`;

const vaultsQuery = gql`
  query {
    spools {
      id
      name
      riskTolerance
      underlying {
        id
        decimals
        symbol
      }
      riskProvider {
        id
        feeSize
      }
      fees {
        feeSize
      }
      strategies(orderBy: position, orderDirection: asc) {
        id
        position
        allocation
        strategy {
          id
          riskScores {
            riskScore
            riskProvider {
              id
            }
          }
        }
      }
      rewardTokens {
        id
        token {
          id
          name
          symbol
          decimals
        }
        rewardRate
        startTime
        endTime
        totalAmount
        isRemoved
      }
    }
  }
`;

const riskModels = { '0xc216ad6280f4fa92a5159ef383a1206d432481c8': 'Spool Labs' };

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSpoolVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SpoolContractFactory) private readonly spoolContractFactory: SpoolContractFactory,
  ) {}

  /**
   * Fetch reward token analytics
   * @param vaults
   */
  async getRewardAnalytics(vaults: string[]): Promise<RewardAnalytics> {
    const addresses = vaults.map(address => `address=${address}`).join('&');
    const url = `${ANALYTICS_API_BASE_URL}/spool/rewards?latest=true&${addresses}`;
    return await Axios.get<RewardAnalytics>(url).then(v => v.data);
  }

  /**
   * Fetch strategy analytics
   * @param strategies
   */
  async getStrategyAnalytics(strategies: string[]): Promise<StrategyAnalytics> {
    const addresses = strategies.map(address => `address=${address}`).join('&');
    const url = `${ANALYTICS_API_BASE_URL}/strategy?latest=true&${addresses}`;
    return await Axios.get<StrategyAnalytics>(url).then(v => v.data);
  }

  /**
   * Fetch vault analytics
   * @param vaults
   */
  async getVaultAnalytics(vaults: string[]): Promise<VaultAnalytics> {
    const addresses = vaults.map(address => `address=${address}`).join('&');
    const url = `${ANALYTICS_API_BASE_URL}/spool?latest=true&${addresses}`;
    return await Axios.get<VaultAnalytics>(url).then(v => v.data);
  }

  async getPositions() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const vaults = (
      await graphHelper.requestGraph<SpoolVaults>({
        endpoint: SUBGRAPH_API_BASE_URL,
        query: vaultsQuery,
      })
    ).spools;

    const platformFees = await graphHelper.requestGraph<Platform>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: platformQuery,
    });

    const tokenAddresses = _.uniq(
      vaults
        .map(vault => vault.underlying.id.toLowerCase())
        .concat(_.flattenDeep(vaults.map(vault => vault.rewardTokens.map(token => token.token.id.toLowerCase())))),
    );

    const tokens = await Promise.all(
      tokenAddresses.map((address: string) => this.appToolkit.getBaseTokenPrice({ network, address })),
    );

    const strategyAddresses = _.uniq(
      _.flattenDeep(vaults.map(vault => vault.strategies.map(strategy => strategy.strategy.id))),
    );

    const vaultAddresses = vaults.map(vault => vault.id.toLowerCase());
    const strategyAnalytics = await this.getStrategyAnalytics(strategyAddresses);
    const vaultAnalytics = await this.getVaultAnalytics(vaultAddresses);
    const rewardAnalytics = await this.getRewardAnalytics(vaultAddresses);

    const vaultDefinitions = await Promise.all(
      vaults.map(async (vault: VaultDetails) => {
        const stats = this.getVaultStats(vault, strategyAnalytics, rewardAnalytics, vaultAnalytics, platformFees);
        const vaultTokens = this.getVaultTokens(vault, tokens);
        const riskTolerance = parseInt(vault.riskTolerance);

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: vault.id,
          network,
          tokens: vaultTokens,
          dataProps: {
            totalValueRouted: stats.tvr,
            apy: stats.apy,
            adjustedApy: stats.adjustedApy,
            incentivizedApy: stats.incentivizedApy,
            fees: stats.fees,
            strategies: vault.strategies.map(strategy => strategy.strategy.id),
            riskScore: this.getRiskScoreString(riskTolerance),
            riskTolerance,
          },
          displayProps: {
            label: vault.name,
            secondaryLabel: vault.underlying.symbol,
            images: [],
            statsItems: [
              { label: 'APY', value: buildPercentageDisplayItem(stats.adjustedApy * 100) },
              { label: 'TVR', value: buildDollarDisplayItem(stats.tvr) },
              { label: 'Risk Model', value: buildStringDisplayItem(riskModels[vault.riskProvider.id] || '') },
              { label: 'Asset', value: buildStringDisplayItem(vault.underlying.symbol) },
              {
                label: 'Risk Appetite',
                value: buildStringDisplayItem(
                  `${this.getRiskScoreString(riskTolerance)} (${this.mapRiskToRange(riskTolerance)})`,
                ),
              },
            ],
          },
        };

        return position;
      }),
    );

    return _.compact(vaultDefinitions);
  }

  /**
   * Calculate APY, TVR (total value routed) and fees.
   * @param vault
   * @param strategyAnalytics
   * @param rewardAnalytics
   * @param vaultAnalytics
   * @param platformFees
   */
  getVaultStats(
    vault: VaultDetails,
    strategyAnalytics: StrategyAnalytics,
    rewardAnalytics: RewardAnalytics,
    vaultAnalytics: VaultAnalytics,
    platformFees: Platform,
  ) {
    const fees =
      parseFloat(platformFees.platform.ecosystemFeeSize) +
      parseFloat(platformFees.platform.treasuryFeeSize) +
      parseFloat(vault.fees.feeSize) +
      parseFloat(vault.riskProvider.feeSize);

    const stats =
      vaultAnalytics[vault.id] && vaultAnalytics[vault.id].length
        ? vaultAnalytics[vault.id][0]
        : { tvr: '0', apy: 0, timestamp: 0 };

    const baseApy = vault.strategies
      .filter(strategy => strategyAnalytics[strategy.strategy.id])
      .map(strategy => parseFloat(strategy.allocation) * strategyAnalytics[strategy.strategy.id][0].apy)
      .reduce((a, b) => a + b, 0);

    const apy = stats.apy || baseApy;
    const tvr = parseFloat(stats.tvr);

    const incentivizedApy = Object.values(rewardAnalytics[vault.id] || {})
      .map(rewardToken => parseFloat(rewardToken[0].apy))
      .reduce((a, b) => a + b, 0);
    const adjustedApy = apy * ((100 - fees) / 100) + incentivizedApy || apy;

    return {
      adjustedApy,
      incentivizedApy,
      apy,
      tvr,
      fees,
    };
  }

  /**
   * Extract underlying and reward tokens
   * @param vault
   * @param tokens
   */
  getVaultTokens(vault: VaultDetails, tokens: Awaited<BaseToken | null>[]): WithMetaType<Token>[] {
    const underlyingToken = tokens.find(token => token?.address == vault.underlying.id);
    if (!underlyingToken) {
      return [];
    }

    const rewardTokenAddresses = vault.rewardTokens.map(token => token.token.id.toLowerCase());
    const rewardTokens = tokens
      .filter((token): token is BaseToken => token !== null)
      .filter(token => rewardTokenAddresses.includes(token.address.toLowerCase()))
      .map(token => token && claimable(token));

    return [supplied(underlyingToken), ...rewardTokens];
  }

  getRiskScoreString(riskTolerance: number) {
    const risk = this.mapRiskToRange(riskTolerance);

    switch (true) {
      case risk > 5:
        return 'Risk Seeking';
      case risk === 5:
        return 'Risk Neutral';
      default:
        return 'Risk Averse';
    }
  }

  /**
   * Map [-10, 10] to [0, 10]
   * @param risk
   */
  mapRiskToRange(risk: number) {
    const [inMin, inMax] = [-10, 10];
    const [outMin, outMax] = [0, 10];
    return ((risk - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  }
}
