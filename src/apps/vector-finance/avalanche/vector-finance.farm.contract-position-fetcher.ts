import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ViemMulticallDataLoader } from '~multicall';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { isClaimable, isSupplied } from '~position/position.utils';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  GetMasterChefV2ExtraRewardTokenBalancesParams,
  GetMasterChefV2ExtraRewardTokenRewardRates,
  MasterChefV2ContractPositionDataProps,
  MasterChefV2TemplateContractPositionFetcher,
} from '~position/template/master-chef-v2.template.contract-position-fetcher';
import {
  GetMasterChefDataPropsParams,
  MasterChefContractPositionDataProps,
  MasterChefContractPositionDefinition,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { VectorFinanceViemContractFactory } from '../contracts';
import { VectorFinanceMasterChef, VectorFinanceMasterChefRewarder } from '../contracts/viem';
import { VectorFinanceMasterChefContract } from '../contracts/viem/VectorFinanceMasterChef';
import { VectorFinanceMasterChefRewarderContract } from '../contracts/viem/VectorFinanceMasterChefRewarder';

@PositionTemplate()
export class AvalancheVectorFinanceFarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  VectorFinanceMasterChef,
  VectorFinanceMasterChefRewarder
> {
  groupLabel = 'Farms';
  chefAddress = '0x423d0fe33031aa4456a17b150804aa57fc157d97';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VectorFinanceViemContractFactory) protected readonly contractFactory: VectorFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.vectorFinanceMasterChef({ address, network: this.network });
  }

  getExtraRewarderContract(address: string) {
    return this.contractFactory.vectorFinanceMasterChefRewarder({ address, network: this.network });
  }

  async getPoolLength(contract: VectorFinanceMasterChefContract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(
    contract: VectorFinanceMasterChefContract,
    poolIndex: number,
    multicall: ViemMulticallDataLoader,
  ): Promise<string> {
    const registeredToken = await contract.read.registeredToken([BigInt(poolIndex)]);
    const poolInfo = await contract.read.addressToPoolInfo([registeredToken]);

    const helper = this.contractFactory.vectorFinanceMasterChefPoolHelper({
      address: poolInfo[5],
      network: this.network,
    });

    return multicall.wrap(helper).read.depositToken();
  }

  getRewardTokenAddress(contract: VectorFinanceMasterChefContract): Promise<string> {
    return contract.read.vtx();
  }

  async getExtraRewarder(contract: VectorFinanceMasterChefContract, poolIndex: number): Promise<string> {
    const registeredToken = await contract.read.registeredToken([BigInt(poolIndex)]);
    const poolInfo = await contract.read.addressToPoolInfo([registeredToken]);
    return poolInfo[4];
  }

  async getExtraRewardTokenAddresses(contract: VectorFinanceMasterChefRewarderContract) {
    const rewardTokens = await Promise.all(
      range(0, 2).map(i => {
        return contract.read.rewardTokens([BigInt(i)]).catch(err => {
          if (isViemMulticallUnderlyingError(err)) return null;
          throw err;
        });
      }),
    );

    return compact(rewardTokens);
  }

  async getReserve({
    contract,
    contractPosition,
    definition,
  }: GetDataPropsParams<
    VectorFinanceMasterChef,
    MasterChefV2ContractPositionDataProps,
    MasterChefContractPositionDefinition
  >): Promise<number> {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const registeredToken = await contract.read.registeredToken([BigInt(definition.poolIndex)]);
    const poolInfo = await contract.read.getPoolInfo([registeredToken]);
    return Number(poolInfo[2]) / 10 ** stakedToken.decimals;
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<VectorFinanceMasterChef>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<VectorFinanceMasterChef>) {
    return contract.read.vtxPerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<VectorFinanceMasterChef>) {
    const registeredToken = await contract.read.registeredToken([BigInt(definition.poolIndex)]);
    const poolInfo = await contract.read.addressToPoolInfo([registeredToken]);
    return poolInfo[1];
  }

  async getExtraRewardTokenRewardRates({
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<VectorFinanceMasterChef, VectorFinanceMasterChefRewarder>) {
    // @TODO Not sure, there's no reward rate, just a reward per token
    const [, ...extraRewardTokens] = contractPosition.tokens.filter(isClaimable);
    return Promise.all(extraRewardTokens.map(async () => 0));
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<VectorFinanceMasterChef, MasterChefContractPositionDataProps>): Promise<BigNumberish> {
    const registeredToken = await contract.read.registeredToken([BigInt(contractPosition.dataProps.poolIndex)]);
    return contract.read.depositInfo([registeredToken, address]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<VectorFinanceMasterChef, MasterChefContractPositionDataProps>): Promise<BigNumberish> {
    const anyClaimable = contractPosition.tokens.find(isClaimable)!;
    const registeredToken = await contract.read.registeredToken([BigInt(contractPosition.dataProps.poolIndex)]);
    const pendingTokens = await contract.read.pendingTokens([registeredToken, address, anyClaimable?.address]);
    return pendingTokens[0];
  }

  async getExtraRewardTokenBalances({
    address,
    contractPosition,
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<VectorFinanceMasterChef, VectorFinanceMasterChefRewarder>) {
    const [, ...extraRewardTokens] = contractPosition.tokens.filter(isClaimable);
    return Promise.all(extraRewardTokens.map(v => rewarderContract.read.earned([address, v.address])));
  }
}
