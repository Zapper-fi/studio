import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { SpoolContractFactory } from '~apps/spool';
import { ANALYTICS_API_BASE_URL, SUBGRAPH_API_BASE_URL } from '~apps/spool/ethereum/spool.constants';
import { WithMetaType } from '~position/display.interface';
import { MetaType, Token } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { BaseToken } from '~position/token.interface';

import { SpoolVault } from '../contracts';

import { Platform, RewardAnalytics, VaultDetails, SpoolVaults, StrategyAnalytics, VaultAnalytics } from './spool.types';

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

export type SpoolVaultDefinition = {
  address: string;
  name: string;
  riskModel: string;
  suppliedTokenAddress: string;
  rewardTokenAddresses: string[];
  strategyAddresses: string[];
  stats: {
    riskTolerance: number;
    adjustedApy: number;
    incentivizedApy: number;
    apy: number;
    tvr: number;
    fees: number;
  };
};

export type SpoolVaultDataProps = {
  totalValueRouted: number;
  apy: number;
  adjustedApy: number;
  incentivizedApy: number;
  fees: number;
  strategies: string[];
  riskScore: string;
  riskTolerance: number;
};

@PositionTemplate()
export class EthereumSpoolVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SpoolVault,
  SpoolVaultDataProps,
  SpoolVaultDefinition
> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SpoolContractFactory) protected readonly spoolContractFactory: SpoolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SpoolVault {
    return this.spoolContractFactory.spoolVault({ address, network: this.network });
  }

  async getDefinitions() {
    // Request all vaults
    const vaultsData = await this.appToolkit.helpers.theGraphHelper.requestGraph<SpoolVaults>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: vaultsQuery,
    });

    // Request platform fees
    const platformFees = await this.appToolkit.helpers.theGraphHelper.requestGraph<Platform>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: platformQuery,
    });

    const vaultAddresses = vaultsData.spools.map(v => v.id.toLowerCase());
    const strategyAddresses = uniq(vaultsData.spools.flatMap(v => v.strategies.map(v => v.strategy.id.toLowerCase())));

    // Request strategy, vault, and reward analytics
    const strategyAnalytics = await this.getStrategyAnalytics(strategyAddresses);
    const vaultAnalytics = await this.getVaultAnalytics(vaultAddresses);
    const rewardAnalytics = await this.getRewardAnalytics(vaultAddresses);

    const vaultDefinitions = vaultsData.spools.map(vault => ({
      address: vault.id.toLowerCase(),
      name: vault.name,
      riskModel: vault.riskProvider.id ?? '',
      suppliedTokenAddress: vault.underlying.id.toLowerCase(),
      rewardTokenAddresses: vault.rewardTokens.map(rt => rt.token.id.toLowerCase()),
      strategyAddresses: vault.strategies.map(s => s.strategy.id.toLowerCase()),
      stats: this.getVaultStats(vault, strategyAnalytics, rewardAnalytics, vaultAnalytics, platformFees),
    }));

    return vaultDefinitions;
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<SpoolVault, SpoolVaultDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.suppliedTokenAddress, network: this.network },
      ...definition.rewardTokenAddresses.map(address => ({
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      })),
    ];
  }

  async getDataProps({ definition }: GetDataPropsParams<SpoolVault, any, SpoolVaultDefinition>) {
    return {
      totalValueRouted: definition.stats.tvr,
      apy: definition.stats.apy,
      adjustedApy: definition.stats.adjustedApy,
      incentivizedApy: definition.stats.incentivizedApy,
      fees: definition.stats.fees,
      strategies: definition.strategyAddresses,
      riskScore: this.getRiskScoreString(definition.stats.riskTolerance),
      riskTolerance: definition.stats.riskTolerance,
    };
  }

  async getLabel({ definition }: GetDisplayPropsParams<SpoolVault, SpoolVaultDataProps, SpoolVaultDefinition>) {
    return definition.name;
  }

  async getSecondaryLabel({
    contractPosition,
  }: GetDisplayPropsParams<SpoolVault, SpoolVaultDataProps, SpoolVaultDefinition>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getStatsItems({ definition }: GetDisplayPropsParams<SpoolVault, SpoolVaultDataProps, SpoolVaultDefinition>) {
    return [
      { label: 'APY', value: buildPercentageDisplayItem(definition.stats.adjustedApy * 100) },
      { label: 'TVR', value: buildDollarDisplayItem(definition.stats.tvr) },
      { label: 'Risk Model', value: buildStringDisplayItem(riskModels[definition.riskModel]) },
      {
        label: 'Risk Appetite',
        value: buildStringDisplayItem(
          `${this.getRiskScoreString(definition.stats.riskTolerance)} (${this.mapRiskToRange(
            definition.stats.riskTolerance,
          )})`,
        ),
      },
    ];
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<SpoolVault, SpoolVaultDataProps>): Promise<BigNumberish[]> {
    const strategies = contractPosition.dataProps.strategies;

    const [balanceRaw] = await Promise.all([
      multicall.wrap(contract).callStatic.getUpdatedUser(strategies, { from: address }),
    ]);

    // balanceRaw[5] + balanceRaw[7]: pending deposits
    // balanceRaw[4]: user's funds in underlying asset
    const pendingDeposit = balanceRaw[5].add(balanceRaw[7]);
    const balance = balanceRaw[4].add(pendingDeposit);
    return [balance.toString(), ...contractPosition.tokens.slice(1).map(() => '0')];
  }

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

    const apy = stats.apy || baseApy / 100.0;
    const tvr = parseFloat(stats.tvr);

    const riskTolerance = Number(vault.riskTolerance);
    const incentivizedApy = Object.values(rewardAnalytics[vault.id] || {})
      .map(rewardToken => parseFloat(rewardToken[0].apy))
      .reduce((a, b) => a + b, 0);
    const adjustedApy = apy * ((100 - fees) / 100) + incentivizedApy || apy;

    return {
      riskTolerance,
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
