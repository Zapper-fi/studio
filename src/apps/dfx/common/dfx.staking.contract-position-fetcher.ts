import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { DfxViemContractFactory } from '../contracts';
import { DfxStaking } from '../contracts/viem';

type DfxStakingContractPositionDefinition = {
  address: string;
  stakedTokenAddress: string;
  rewardTokenAddress: string;
};

export abstract class DfxStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  DfxStaking,
  DefaultDataProps,
  DfxStakingContractPositionDefinition
> {
  abstract stakingDefinitions: DfxStakingContractPositionDefinition[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DfxViemContractFactory) private readonly contractFactory: DfxViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DfxStakingContractPositionDefinition[]> {
    return this.stakingDefinitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<DfxStaking, DfxStakingContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.stakedTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.dfxStaking({ network: this.network, address });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<DfxStaking>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<DfxStaking>): Promise<BigNumberish[]> {
    const [stakedBalanceRaw, earnedBalanceRaw] = await Promise.all([
      contract.read.balanceOf([address]),
      contract.read.earned([address]),
    ]);

    return [stakedBalanceRaw, earnedBalanceRaw];
  }
}
