import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { StakingThales, ThalesContractFactory } from '../contracts';

export abstract class ThalesStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StakingThales> {
  groupLabel = 'Staking';
  abstract contractAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly contractFactory: ThalesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakingThales {
    return this.contractFactory.stakingThales({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: this.contractAddress }];
  }

  async getTokenDefinitions({ contract }) {
    const thalesAddress = await contract.stakingToken();
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: thalesAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: thalesAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<StakingThales>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Staked ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<StakingThales>): Promise<BigNumberish[]> {
    return Promise.all([contract.stakedBalanceOf(address), contract.getRewardsAvailable(address)]);
  }
}
