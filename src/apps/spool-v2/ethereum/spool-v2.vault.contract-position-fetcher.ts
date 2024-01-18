import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { StrategyRegistryContract } from '~apps/spool-v2/contracts/viem/StrategyRegistry';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SpoolV2ViemContractFactory } from '../contracts';
import { SpoolVault } from '../contracts/viem';

import {
  APY_DECIMALS,
  ASSET_GROUPS_QUERY,
  DEPOSITS_QUERY,
  FEES_QUERY,
  GLOBAL_FEES_QUERY,
  REWARDS_APY_QUERY,
  SPOOL_LENS_ADDRESS,
  STRATEGY_ALLOCATION_QUERY,
  STRATEGY_REGISTRY_ADDRESS,
  SUBGRAPH_API_BASE_URL,
  USER_NFTS_QUERY,
  VAULTS_AND_STRATEGIES_QUERY,
  VAULTS_QUERY,
} from './spool-v2.constants';
import {
  AdjustedApy,
  allocationData,
  assetGroupsData,
  BaseApy,
  depositsQueryData,
  feesData,
  globalFeesData,
  Globals,
  RewardApyReturnType,
  RewardsApy,
  rewardsApyQueryData,
  SmartVaultRewards,
  SpoolVaultDataProps,
  SpoolVaultDefinition,
  SpoolVaults,
  Strategy,
  StrategyAllocation,
  TokenPrice,
  TvrType,
  TvrUsd,
  userNftQueryData,
  Vault,
  VaultAsset,
  VaultDetails,
  vaultQueryData,
  VaultsAnalytics,
} from './spool-v2.types';

const riskModels = { '0xc216ad6280f4fa92a5159ef383a1206d432481c8': 'Spool Labs' };

@PositionTemplate()
export class EthereumSpoolV2VaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SpoolVault,
  SpoolVaultDataProps,
  SpoolVaultDefinition
> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SpoolV2ViemContractFactory) protected readonly spoolV2ContractFactory: SpoolV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string) {
    return this.spoolV2ContractFactory.spoolVault({ address: _address, network: this.network });
  }

  async getDataProps({ definition }: GetDataPropsParams<SpoolVault, any, SpoolVaultDefinition>) {
    return {
      totalValueRoutedSvt: definition.stats.tvr,
      totalValueRoutedUsd: definition.stats.tvrUsd,
      liquidity: parseFloat(definition.stats.tvrUsd),
      baseApy: definition.stats.baseApy,
      adjustedApy: definition.stats.adjustedApy,
      rewardsApy: definition.stats.rewardsApy,
      strategies: definition.strategyAddresses,
      riskScore: this.getRiskScoreString(definition.stats.riskTolerance),
      riskTolerance: definition.stats.riskTolerance,
      vaultAssets: definition.stats.vaultAssets,
    };
  }

  async getDefinitions() {
    const vaultsData = await gqlFetch<SpoolVaults>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: VAULTS_QUERY,
    });

    const fees = await gqlFetch<Globals>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: GLOBAL_FEES_QUERY,
    });

    const vaultAnalytics = await this.getVaultsAnalytics();

    return vaultsData.smartVaults.map(vault => ({
      address: vault.id.toLowerCase(),
      name: vault.name,
      riskModel: vault.riskProvider ? vault.riskProvider.id : '',
      suppliedTokenAddresses: vault.assetGroup.assetGroupTokens.map(agt => agt.token.id.toLowerCase()),
      rewardTokenAddresses:
        vault.smartVaultRewardTokens.length > 0
          ? vault.smartVaultRewardTokens.map(rt => rt.token.id.toLowerCase())
          : null,
      strategyAddresses: vault.smartVaultStrategies.map(s => s.strategy.id.toLowerCase()),
      stats: this.getVaultStats(
        vault,
        vaultAnalytics.smartVaults.find(va => va.id == vault.id),
        fees,
      ),
    }));
  }
  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<SpoolVault, SpoolVaultDataProps>): Promise<BigNumberish[]> {
    const spoolLens = await this.spoolV2ContractFactory.spoolLens({
      address: SPOOL_LENS_ADDRESS,
      network: this.network,
    });

    const userSvtBalance = await spoolLens.read.getUserSVTBalance([
      contractPosition.address,
      address,
      await this.getUserDepositNFTs(address, contractPosition.address),
    ]);
    await userSvtBalance;
    const userSvtBalanceString = userSvtBalance.toString();
    const tvrSvt = contractPosition.dataProps.totalValueRoutedSvt;
    const vaultAssets = contractPosition.dataProps.vaultAssets;
    if (vaultAssets.length == 0 || tvrSvt == '0') return new Array(0);
    const percentage = parseFloat(userSvtBalanceString) / parseFloat(tvrSvt);
    return vaultAssets.map(va => {
      const calculated = percentage * parseFloat(ethers.utils.formatEther(va));
      // below the threshold
      if (calculated < 1) {
        return ethers.constants.Zero;
      }
      return ethers.utils.parseEther((percentage * parseFloat(ethers.utils.formatEther(va))).toString());
    });
  }

  async getUserDepositNFTs(address: string, smartVault: string): Promise<bigint[]> {
    const res = await gqlFetch<userNftQueryData>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: USER_NFTS_QUERY,
      variables: { address, smartVault },
    });
    return res.user.smartVaultDepositNFTs.map(nft => BigInt(nft.nftId));
  }
  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<SpoolVault, SpoolVaultDefinition>) {
    return [
      ...definition.suppliedTokenAddresses.map(address => ({
        metaType: MetaType.SUPPLIED,
        address,
        network: this.network,
      })),
    ];
  }

  async getLabel({ definition }: GetDisplayPropsParams<SpoolVault, SpoolVaultDataProps, SpoolVaultDefinition>) {
    return definition.name;
  }

  async getSecondaryLabel({
    contractPosition,
  }: GetDisplayPropsParams<SpoolVault, SpoolVaultDataProps, SpoolVaultDefinition>) {
    return contractPosition.tokens.map(token => getLabelFromToken(token)).join(', ');
  }
  async getStatsItems({ definition }: GetDisplayPropsParams<SpoolVault, SpoolVaultDataProps, SpoolVaultDefinition>) {
    return [
      { label: 'APY', value: buildPercentageDisplayItem(definition.stats.adjustedApy) },
      { label: 'TVR', value: buildDollarDisplayItem(Number(definition.stats.tvrUsd)) },
      { label: 'Risk Model', value: buildStringDisplayItem(riskModels[definition.riskModel]) },
      {
        label: 'Risk Appetite',
        value: buildStringDisplayItem(
          `${this.getRiskScoreString(definition.stats.riskTolerance)} (${this.mapRiskToRange(
            definition.stats.riskTolerance,
          )})`,
        ),
      },
      {
        label: 'Reward Tokens',
        value: buildStringDisplayItem(
          <string>definition.rewardTokenAddresses?.map(address => address.toString()).join(', '),
        ),
      },
    ];
  }
  /**
   * Calculate APY, TVR (total value routed) and fees.
   * @param vault
   * @param vaultAnalytics
   * @param platformFees
   */
  getVaultStats(
    vault: VaultDetails,
    vaultAnalytics:
      | {
          id: string;
          tvr: string;
          baseApy: string;
          rewardsApy: string[];
          adjustedApy: string;
          tvrUsd: string;
          vaultAssets: BigNumber[];
        }
      | undefined,
    platformFees: Globals,
  ) {
    const fees =
      parseFloat(platformFees.globals.ecosystemFee) +
      parseFloat(platformFees.globals.treasuryFee) +
      parseFloat(vault.smartVaultFees.performanceFeePercentage) +
      parseFloat(vault.smartVaultFees.managementFeePercentage);

    let tvr = '0';
    let tvrUsd = '0';
    let adjustedApy = 0.0;
    let rewardsApys = ['0'];
    let baseApy = 0.0;
    let vaultAssets = ['0'];
    if (vaultAnalytics) {
      tvr = vaultAnalytics.tvr;
      tvrUsd = vaultAnalytics.tvrUsd;
      adjustedApy = parseFloat(vaultAnalytics.adjustedApy) * 100;
      rewardsApys = vaultAnalytics.rewardsApy;
      baseApy = parseFloat(vaultAnalytics.baseApy) * 100;
      vaultAssets = vaultAnalytics.vaultAssets.map(va => va.toString());
    }

    const riskTolerance = Number(vault.riskTolerance);

    return {
      riskTolerance: riskTolerance,
      tvr: tvr,
      tvrUsd: tvrUsd,
      fees: fees,
      adjustedApy: adjustedApy,
      rewardsApy: rewardsApys,
      baseApy: baseApy,
      vaultAssets: vaultAssets,
    };
  }

  /**
   * Fetch vault analytics
   */
  async getVaultsAnalytics(): Promise<VaultsAnalytics> {
    const vaults = await this.getVaults();

    const tvrSvts = await this.getTvrSvts(vaults);
    const baseApys = await this.getBaseApys(vaults);
    const tvrUsds = await this.getTvrUsds(vaults);
    const rewardsApys = await this.getRewardsApys(vaults, tvrUsds);
    const adjustedApys = await this.getAdjustedApys(vaults, baseApys, rewardsApys);
    const vaultAssets: VaultAsset[] = await this.getVaultAssets(vaults);
    const smartVaults = vaults.map(vault => {
      const tvrUsd = tvrUsds.find(tvrUsd => tvrUsd.vault.id == vault.id)?.tvrUsd;
      const tvr = tvrSvts.find(tvrSvt => tvrSvt.vault.id == vault.id)?.tvr;
      const baseApy = baseApys.find(baseApy => baseApy.vault.id == vault.id)?.baseApy;
      const rewardsApy = rewardsApys.find(rewardsApy => rewardsApy.vault.id == vault.id)?.rewardsApys;
      const adjustedApy = adjustedApys.find(adjustedApy => adjustedApy.vault.id == vault.id)?.adjustedApy;
      const vaultAsset = vaultAssets.find(vaultAsset => vaultAsset.vault.id == vault.id);
      if (!tvrUsd || !tvr || !baseApy || !rewardsApy || !adjustedApy || !vaultAsset) {
        throw new Error('Missing data for vault analytics');
      }
      return {
        id: vault.id,
        tvr: tvr.toString(),
        tvrUsd: tvrUsd.toString(),
        baseApy: baseApy,
        rewardsApy: rewardsApy,
        adjustedApy: adjustedApy,
        vaultAssets: vaultAsset.assets,
      };
    });
    return {
      smartVaults: smartVaults,
    };
  }

  async getVaults(): Promise<Vault[]> {
    const data = await gqlFetch<vaultQueryData>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: VAULTS_AND_STRATEGIES_QUERY,
    });
    if (data === undefined) {
      throw new Error('No data returned from queryVaultData');
    }
    return this.processVaultData(data);
  }

  processVaultData(vaultQueryData: vaultQueryData): Vault[] {
    const vaults: Vault[] = [];
    for (const vault of vaultQueryData.smartVaults) {
      const tempVault: Vault = { id: '', strategies: [] };
      tempVault.id = vault.id.toLowerCase();
      for (const strategy of vault.smartVaultStrategies) {
        tempVault.strategies.push({
          id: strategy.strategy.id.toLowerCase(),
        });
      }
      vaults.push(tempVault);
    }
    return vaults;
  }

  async getTokenPrices(assetGroupsData: assetGroupsData): Promise<TokenPrice[]> {
    const tokenPrices: TokenPrice[] = [];
    for (const smartVault of assetGroupsData.smartVaults) {
      for (const token of smartVault.assetGroup.assetGroupTokens) {
        const baseToken = await this.appToolkit.getBaseTokenPrice({
          network: this.network,
          address: token.token.id,
        });
        if (baseToken === null) {
          tokenPrices.push({ token: token.token.id, price: '0' });
        } else {
          tokenPrices.push({ token: token.token.id, price: baseToken.price.toString() });
        }
      }
    }
    return tokenPrices;
  }

  async getTvrUsds(vaults: Vault[]): Promise<TvrUsd[]> {
    const assetGroupsData = await gqlFetch<assetGroupsData>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: ASSET_GROUPS_QUERY,
    });
    if (assetGroupsData === undefined) {
      throw new Error('No data returned from queryAssetGroupData');
    }
    const vaultAssets: VaultAsset[] = await this.getVaultAssets(vaults);
    const prices: TokenPrice[] = await this.getTokenPrices(assetGroupsData);
    return this.processTvrUsds(vaults, assetGroupsData, vaultAssets, prices);
  }

  async getVaultAssets(vaults: Vault[]): Promise<VaultAsset[]> {
    const spoolLens = this.spoolV2ContractFactory.spoolLens({ address: SPOOL_LENS_ADDRESS, network: this.network });
    const vaultAssets: VaultAsset[] = [];
    for (const vault of vaults) {
      const assetsBigint: readonly bigint[] = (await spoolLens.simulate.getSmartVaultAssetBalances([vault.id, false]))
        .result;
      const assets: BigNumber[] = assetsBigint.map(asset => ethers.BigNumber.from(asset));
      vaultAssets.push({ vault: vault, assets: assets });
    }
    return vaultAssets;
  }

  processTvrUsds(
    vaults: Vault[],
    assetGroupData: assetGroupsData,
    vaultAssets: VaultAsset[],
    prices: TokenPrice[],
  ): TvrUsd[] {
    const tvrUsds: TvrUsd[] = [];
    for (const vault of vaults) {
      let sum = 0;
      for (const assetAmount of vaultAssets[vaults.indexOf(vault)].assets) {
        const token =
          assetGroupData.smartVaults[vaults.indexOf(vault)].assetGroup.assetGroupTokens[
            vaultAssets[vaults.indexOf(vault)].assets.indexOf(assetAmount)
          ].token;
        const tokenId = token.id;
        const tokenDecimals = token.decimals;
        const assetAmountFormatted = Number(ethers.utils.formatUnits(assetAmount, tokenDecimals));
        const tokenPrice = prices.find(tokenPrice => tokenPrice.token == tokenId);
        if (tokenPrice == undefined) {
          continue;
        }
        sum += assetAmountFormatted * parseFloat(tokenPrice.price);
      }
      tvrUsds.push({ vault: vault, tvrUsd: sum.toString() });
    }
    return tvrUsds;
  }

  async getBaseApys(vaults: Vault[]): Promise<BaseApy[]> {
    const decimals = APY_DECIMALS;

    const strategyRegistry = this.spoolV2ContractFactory.strategyRegistry({
      address: STRATEGY_REGISTRY_ADDRESS,
      network: this.network,
    });
    const strategyAllocations = await gqlFetch<allocationData>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: STRATEGY_ALLOCATION_QUERY,
    });
    if (strategyAllocations === undefined) {
      throw new Error('No data returned from getAllocations');
    }
    const strategiesRetn = this.getUniqueStrategyAddresses(vaults);
    const stratAPYs = await this.getStrategyApys(strategiesRetn, strategyRegistry);
    return this.processBaseApyData(vaults, strategyAllocations, stratAPYs, decimals);
  }

  getUniqueStrategyAddresses(vaults: Vault[]): Strategy[] {
    const strategiesRetn: Strategy[] = [];
    for (const vault of vaults) {
      for (const strategy of vault.strategies) {
        if (!strategiesRetn.includes(strategy)) {
          strategiesRetn.push(strategy);
        }
      }
    }
    return strategiesRetn;
  }

  async getStrategyApys(
    strategyAddresses: Strategy[],
    strategyRegistry: StrategyRegistryContract,
  ): Promise<Map<string, BigNumber>> {
    const strategyIds = strategyAddresses.map(strategy => strategy.id);
    const stratAPYsBigint: readonly bigint[] = await strategyRegistry.read.strategyAPYs([strategyIds]);
    const stratAPYs: BigNumber[] = stratAPYsBigint.map(stratApy => ethers.BigNumber.from(stratApy));
    const mapReturn = new Map<string, BigNumber>();
    for (const stratApy of stratAPYs) {
      mapReturn.set(strategyIds[stratAPYs.indexOf(stratApy)], stratApy);
    }
    return mapReturn;
  }

  processBaseApyData(
    vaults: Vault[],
    strategyAllocationDatas: allocationData,
    strategyAPYs: Map<string, BigNumber>,
    decimals: string,
  ): BaseApy[] {
    const strategyAllocations: StrategyAllocation[] = [];
    for (const vault of vaults) {
      const allocations: string[] = [];
      const strategies: Strategy[] = [];
      for (const strategyAllocationData of strategyAllocationDatas.smartVaults) {
        if (vault.id == strategyAllocationData.id) {
          for (const strategyAllocationDataStrategy of strategyAllocationData.smartVaultStrategies) {
            if (!strategyAllocationDataStrategy.isRemoved) {
              allocations.push(strategyAllocationDataStrategy.allocation);
            } else {
              allocations.push('0');
            }
            strategies.push({
              id: strategyAllocationDataStrategy.strategy.id.toLowerCase(),
            });
          }
        }
      }
      strategyAllocations.push({
        vault: vault,
        allocations: allocations,
        strategies: strategies,
      });
    }
    const apys: BigNumber[] = [];
    for (const vault of vaults) {
      apys[vaults.indexOf(vault)] = ethers.constants.Zero;
      for (const strategy of vault.strategies) {
        const strategyAPY = strategyAPYs.get(strategy.id);
        if (strategyAPY == undefined) {
          throw new Error('Strategy APY is undefined');
        }
        const x = BigNumber.from(
          strategyAllocations[vaults.indexOf(vault)].allocations[vault.strategies.indexOf(strategy)],
        );
        apys[vaults.indexOf(vault)] = apys[vaults.indexOf(vault)].add(strategyAPY.mul(x));
      }
    }
    const baseApys: BaseApy[] = [];

    for (const vault of vaults) {
      baseApys.push({
        vault: vault,
        baseApy: ((Number(apys[vaults.indexOf(vault)]) / Math.pow(10, Number.parseInt(decimals))) * 100).toString(),
      });
    }

    return baseApys;
  }
  async getRewardsApys(vaults: Vault[], tvrUsds: TvrUsd[]): Promise<RewardsApy[]> {
    const rewardApysFirstPart = await this.getRewardApys();
    return this.processRewardsApys(rewardApysFirstPart, vaults, tvrUsds);
  }
  async getRewardApys(): Promise<RewardApyReturnType[]> {
    const now = Math.floor(Date.now() / 1000).toString();
    const res = await gqlFetch<rewardsApyQueryData>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: REWARDS_APY_QUERY,
      variables: { now },
    });

    const data = res.smartVaults as SmartVaultRewards[];

    return await Promise.all(
      data
        .filter(vault => vault.smartVaultRewardTokens.length > 0)
        .map(async vault => {
          return {
            vaultId: vault.id,
            rewardTokens: await Promise.all(
              vault.smartVaultRewardTokens.map(async reward => {
                const baseToken = await this.appToolkit.getBaseTokenPrice({
                  network: this.network,
                  address: reward.token.id as string,
                });
                let apy = '0';
                if (baseToken != undefined) {
                  apy = (
                    parseFloat(
                      BigNumber.from(reward.rewardRate)
                        .div(BigNumber.from(10).pow(reward.token.decimals))
                        .mul(BigNumber.from(60))
                        .mul(BigNumber.from(60))
                        .mul(BigNumber.from(24))
                        .mul(BigNumber.from(365))
                        .toString(),
                    ) * baseToken.price
                  ).toString();
                }
                return {
                  id: reward.token.id,
                  rewardRate: reward.rewardRate,
                  decimals: reward.token.decimals,
                  apy: apy,
                };
              }),
            ),
          };
        }),
    );
  }

  processRewardsApys(data: RewardApyReturnType[], vaults: Vault[], tvrUsds: TvrUsd[]): RewardsApy[] {
    const decimals = APY_DECIMALS;
    const calculationHelper = new Map<string, BigNumber[]>();
    const result: string[][] = [];
    for (const rewardManagerApy of data) {
      const vaultAddress = rewardManagerApy.vaultId;
      if (calculationHelper.get(vaultAddress) == undefined) {
        calculationHelper.set(vaultAddress, []);
      }
      const insertHelper = calculationHelper.get(vaultAddress);
      for (const rewardToken of rewardManagerApy.rewardTokens) {
        if (insertHelper != null) {
          insertHelper.push(BigNumber.from(BigInt(parseFloat(rewardToken.apy))));
          calculationHelper.set(vaultAddress, insertHelper);
        }
      }
    }

    for (const vault of vaults) {
      result[vaults.indexOf(vault)] = [];
      for (const rewardManagerApy of data) {
        if (vault.id == rewardManagerApy.vaultId) {
          const calculationHelperValues = calculationHelper.get(vault.id);
          if (calculationHelperValues == undefined) {
            throw new Error('calculationHelperValues is undefined');
          }
          for (const apy of calculationHelperValues) {
            if (tvrUsds[vaults.indexOf(vault)].tvrUsd == '0') {
              result[vaults.indexOf(vault)].push('0');
              continue;
            }
            result[vaults.indexOf(vault)].push(
              (
                Number(
                  apy
                    .mul(BigNumber.from(10).pow(Number.parseInt(decimals)))
                    .div(BigNumber.from(tvrUsds[vaults.indexOf(vault)].tvrUsd.split('.')[0]))
                    .div(BigNumber.from(10).pow(Number.parseInt(decimals))),
                ) / Math.pow(10, 18)
              ).toString(),
            );
          }
        }
      }
    }

    const rewardsApys: RewardsApy[] = [];
    for (const vault of vaults) {
      rewardsApys[vaults.indexOf(vault)] = {
        vault: vault,
        rewardsApys: result[vaults.indexOf(vault)],
      };
    }
    return rewardsApys;
  }

  async getAdjustedApys(vaults: Vault[], baseApys: BaseApy[], rewardsApys: RewardsApy[]): Promise<AdjustedApy[]> {
    const globalFeesData = await gqlFetch<globalFeesData>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: GLOBAL_FEES_QUERY,
    });

    const feesData = await gqlFetch<feesData>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: FEES_QUERY,
    });

    if (globalFeesData === undefined) {
      throw new Error('No data returned from queryGlobalFeesData');
    }
    if (feesData === undefined) {
      throw new Error('No data returned from queryFeesData');
    }
    return this.processAdjustedApys(vaults, baseApys, rewardsApys, globalFeesData, feesData);
  }

  processAdjustedApys(
    vaults: Vault[],
    baseApys: BaseApy[],
    rewardsApys: RewardsApy[],
    globalFeesData: globalFeesData,
    feesData: feesData,
  ): AdjustedApy[] {
    const adjustedApys: AdjustedApy[] = [];

    const globalFee =
      parseInt(globalFeesData.globals[0].treasuryFee) + parseInt(globalFeesData.globals[0].ecosystemFee);
    for (const vault of vaults) {
      let apySum = 0;

      const fees = feesData.smartVaults.find(v => v.id == vault.id);
      if (fees == undefined) {
        throw new Error('No fees found for vault ' + vault.id);
      }
      const feesSmartVaultFees = fees.smartVaultFees;

      const baseApy = baseApys.find(apy => apy.vault.id == vault.id);
      if (baseApy == undefined) {
        throw new Error('No baseApy found for vault ' + vault.id);
      }
      const baseApyData = Number(baseApy.baseApy);

      apySum =
        baseApyData *
        ((100 -
          (parseFloat(feesSmartVaultFees.managementFeePercentage) +
            parseFloat(feesSmartVaultFees.performanceFeePercentage) +
            globalFee)) /
          100);

      const rewardApy = rewardsApys.find(apy => apy.vault.id == vault.id);
      if (rewardApy != undefined) {
        for (const apy of rewardApy.rewardsApys) {
          apySum += Number(apy);
        }
      }

      adjustedApys.push({ vault: vault, adjustedApy: apySum.toString() });
    }
    return adjustedApys;
  }

  async getTvrSvts(vaults: Vault[]): Promise<TvrType[]> {
    const smartVaultDeposits = await gqlFetch<depositsQueryData>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: DEPOSITS_QUERY,
    });

    return this.processTvrSvts(vaults, smartVaultDeposits);
  }

  async processTvrSvts(vaults: Vault[], smartVaultDeposits: depositsQueryData | undefined): Promise<TvrType[]> {
    const spoolLens = this.spoolV2ContractFactory.spoolLens({ address: SPOOL_LENS_ADDRESS, network: this.network });
    const tvrs: TvrType[] = [];
    if (smartVaultDeposits == undefined) {
      return tvrs;
    }
    const tvrCalculationsBigint: readonly bigint[] = await Promise.all(
      vaults.map(vault => spoolLens.read.getSVTTotalSupply([vault.id])),
    );
    const tvrCalculations: BigNumber[] = tvrCalculationsBigint.map(asset => ethers.BigNumber.from(asset));

    for (const vault of smartVaultDeposits.smartVaults) {
      for (const smartVaultDeposit of vault.smartVaultFlushes) {
        if (smartVaultDeposit.isExecuted && !smartVaultDeposit.strategyDHWs[0].isExecuted) {
          for (const flush of vault.smartVaultFlushes) {
            if (smartVaultDeposit.id == flush.id) {
              for (const smartVaultWithdrawalNft of flush.SmartVaultWithdrawalNFTs) {
                tvrCalculations[smartVaultDeposits.smartVaults.indexOf(vault)] = tvrCalculations[
                  smartVaultDeposits.smartVaults.indexOf(vault)
                ].add(smartVaultWithdrawalNft.svtWithdrawn);
              }
            }
          }
        }
      }
    }
    for (const vault of vaults) {
      tvrs.push({
        vault: vault,
        tvr: tvrCalculations[vaults.indexOf(vault)],
      });
    }
    return tvrs;
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
  mapRiskToRange(risk: number) {
    const [inMin, inMax] = [-10, 10];
    const [outMin, outMax] = [0, 10];
    return ((risk - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  }
}
