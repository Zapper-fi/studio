import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { AcrossContractFactory, AcrossStaking } from '../contracts';

export type AcrossStakingContractPositionDefinition = {
  address: string;
  underlyingTokenAddress: string;
  rewardTokenAddress: string;
};

export abstract class AcrossStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  AcrossStaking,
  DefaultDataProps,
  AcrossStakingContractPositionDefinition
> {
  abstract acceleratingDistributorAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossContractFactory) protected readonly contractFactory: AcrossContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AcrossStaking {
    return this.contractFactory.acrossStaking({ address, network: this.network });
  }

  async getDefinitions(): Promise<AcrossStakingContractPositionDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['pool-v2'],
    });

    const acceleratingDistributorContract = this.contractFactory.acrossStaking({
      address: this.acceleratingDistributorAddress,
      network: this.network,
    });
    const rewardTokenAddress = await multicall.wrap(acceleratingDistributorContract).rewardToken();

    return appTokens.map(pool => {
      return {
        address: this.acceleratingDistributorAddress,
        underlyingTokenAddress: pool.address,
        rewardTokenAddress: rewardTokenAddress.toLowerCase(),
      };
    });
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<AcrossStaking, AcrossStakingContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AcrossStaking>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract, contractPosition }: GetTokenBalancesParams<AcrossStaking>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const [supplied, rewards] = await Promise.all([
      contract.getUserStake(stakedToken.address, address),
      contract.getOutstandingRewards(stakedToken.address, address),
    ]);
    return [supplied.cumulativeBalance, rewards];
  }
}
