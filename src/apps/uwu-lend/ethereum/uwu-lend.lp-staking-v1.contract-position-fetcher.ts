import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { UwuLendContractFactory, UwuLendMultiFeeV1 } from '../contracts';

export type UwuLendLpStakingV1ContractPositionDefinition = {
  address: string;
  underlyingTokenAddress: string;
  rewardTokenAddresses: string[];
};

@PositionTemplate()
export class EthereumUwuLendLpStakingV1ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<UwuLendMultiFeeV1> {
  groupLabel = 'Lp Staking V1';

  // Temporary removed from rewards until CG support SIFUM
  NotSupportedToken = '0x8028ea7da2ea9bcb9288c1f6f603169b8aea90a6';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UwuLendContractFactory) protected readonly contractFactory: UwuLendContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<UwuLendLpStakingV1ContractPositionDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const multiFeeV1Address = '0x7c0bf1108935e7105e218bbb4f670e5942c5e237';
    const multiFeeV1Contract = this.contractFactory.uwuLendMultiFeeV1({
      address: multiFeeV1Address,
      network: this.network,
    });
    const [rewards, underlyingTokenAddressRaw] = await Promise.all([
      multicall.wrap(multiFeeV1Contract).claimableRewards(ZERO_ADDRESS),
      multicall.wrap(multiFeeV1Contract).stakingToken(),
    ]);
    const rewardTokenAddressesRaw = rewards.map(x => x.token.toLowerCase());

    const rewardTokenAddresses = rewardTokenAddressesRaw.filter(v => v !== this.NotSupportedToken);

    return [
      {
        address: multiFeeV1Address,
        underlyingTokenAddress: underlyingTokenAddressRaw.toLowerCase(),
        rewardTokenAddresses,
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<UwuLendMultiFeeV1, UwuLendLpStakingV1ContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
      ...definition.rewardTokenAddresses.map(address => {
        return {
          metaType: MetaType.CLAIMABLE,
          address,
          network: this.network,
        };
      }),
    ];
  }

  getContract(address: string): UwuLendMultiFeeV1 {
    return this.contractFactory.uwuLendMultiFeeV1({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `Lp Staking V1`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<UwuLendMultiFeeV1>) {
    const lockedBalances = await contract.lockedBalances(address);
    const supplied = lockedBalances.total;
    const rewardBalances = await contract.claimableRewards(address);
    const rewardsRaw = rewardBalances.map(r => {
      if (this.NotSupportedToken === r.token.toLowerCase()) {
        return null;
      }
      return r.amount;
    });
    const rewards = _.compact(rewardsRaw);

    return [supplied, ...rewards];
  }
}
