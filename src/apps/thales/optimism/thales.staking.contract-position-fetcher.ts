import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { StakingThales, ThalesContractFactory } from '../contracts';

@PositionTemplate()
export class OptimismThalesStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StakingThales> {
  groupLabel = 'Staking';

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
    return [{ address: '0xc392133eea695603b51a5d5de73655d571c2ce51' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x217d47011b23bb961eb6d93ca9945b7501a5bb11',
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x217d47011b23bb961eb6d93ca9945b7501a5bb11',
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
