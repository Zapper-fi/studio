import { Inject, NotImplementedException } from '@nestjs/common';
import _, { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { DhedgeV2ViemContractFactory } from '../contracts';
import { DhedgeV2Staking } from '../contracts/viem';

export type DhedgeStakingV2ContractPositionDefinition = {
  address: string;
  stakingTokenAddress: string;
};

export abstract class DhedgeV2StakingContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  DhedgeV2Staking,
  DefaultDataProps,
  DhedgeStakingV2ContractPositionDefinition
> {
  abstract stakingV2ContractAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DhedgeV2ViemContractFactory) protected readonly contractFactory: DhedgeV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.dhedgeV2Staking({ network: this.network, address });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<DhedgeStakingV2ContractPositionDefinition[]> {
    const stakingV2Contract = this.contractFactory.dhedgeV2Staking({
      address: this.stakingV2ContractAddress,
      network: this.network,
    });
    const numStakingPosition = await multicall.wrap(stakingV2Contract).read.numberOfPoolsConfigured();
    const stakingTokenAddresses = await Promise.all(
      range(Number(numStakingPosition)).map(async n => {
        const suppliedTokenAddressRaw = await multicall.wrap(stakingV2Contract).read.poolConfiguredByIndex([BigInt(n)]);
        return suppliedTokenAddressRaw.toLowerCase();
      }),
    );

    return stakingTokenAddresses.map(stakingTokenAddress => {
      return {
        address: this.stakingV2ContractAddress,
        stakingTokenAddress,
      };
    });
  }

  async getTokenDefinitions({
    contract,
    definition,
  }: GetTokenDefinitionsParams<DhedgeV2Staking, DhedgeStakingV2ContractPositionDefinition>) {
    const dhtTokenAddress = await contract.read.dhtAddress();
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: dhtTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: definition.stakingTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: dhtTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<DhedgeV2Staking>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[1]);
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const stakingV2Contract = this.contractFactory.dhedgeV2Staking({
      address: this.stakingV2ContractAddress,
      network: this.network,
    });

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const numPositionsRaw = await multicall.wrap(stakingV2Contract).read.balanceOf([address]);

    const balances = await Promise.all(
      range(0, Number(numPositionsRaw)).map(async index => {
        const tokenId = await multicall.wrap(stakingV2Contract).read.tokenOfOwnerByIndex([address, BigInt(index)]);

        const [suppliedBalances, claimableAmountRaw] = await Promise.all([
          multicall.wrap(stakingV2Contract).read.stakes([tokenId]),
          multicall.wrap(stakingV2Contract).read.currentRewardsForStake([tokenId]),
        ]);
        const lpTokenAddress = suppliedBalances[2];
        const matchingPosition = contractPositions.find(x =>
          x.tokens.find(x => x.address == lpTokenAddress.toLowerCase()),
        );
        if (!matchingPosition || suppliedBalances[6] == true) return null;

        const suppliedDht = suppliedBalances[0];
        const suppliedLp = suppliedBalances[3];

        const depositDhtAmount = drillBalance(matchingPosition.tokens[0], suppliedDht.toString());
        const depositLpAmount = drillBalance(matchingPosition.tokens[1], suppliedLp.toString());
        const claimableBalance = drillBalance(matchingPosition.tokens[2], claimableAmountRaw.toString());

        return {
          ...matchingPosition,
          tokens: [depositDhtAmount, depositLpAmount, claimableBalance],
          balanceUSD: depositDhtAmount.balanceUSD + depositLpAmount.balanceUSD + claimableBalance.balanceUSD,
        };
      }),
    );

    return _.compact(balances);
  }
}
