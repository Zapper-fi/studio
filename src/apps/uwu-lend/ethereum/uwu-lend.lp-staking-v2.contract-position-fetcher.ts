import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { UwuLendContractFactory, UwuLendMultiFeeV2 } from '../contracts';

export type UwuLendLpStakingV2ContractPositionDefinition = {
  address: string;
  underlyingTokenAddress: string;
  rewardTokenAddresses: string[];
};

@PositionTemplate()
export class EthereumUwuLendLpStakingV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  UwuLendMultiFeeV2,
  DefaultDataProps,
  UwuLendLpStakingV2ContractPositionDefinition
> {
  groupLabel = 'Lp Staking V2';

  // Temporary removed from rewards until CG support SIFUM
  NotSupportedToken = '0x8028ea7da2ea9bcb9288c1f6f603169b8aea90a6';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UwuLendContractFactory) protected readonly contractFactory: UwuLendContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<UwuLendLpStakingV2ContractPositionDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const multiFeeV2Address = '0x0a7b2a21027f92243c5e5e777aa30bb7969b0188';
    const multiFeeV2Contract = this.contractFactory.uwuLendMultiFeeV1({
      address: multiFeeV2Address,
      network: this.network,
    });
    const [rewards, underlyingTokenAddressRaw] = await Promise.all([
      multicall.wrap(multiFeeV2Contract).claimableRewards(ZERO_ADDRESS),
      multicall.wrap(multiFeeV2Contract).stakingToken(),
    ]);
    const rewardTokenAddressesRaw = rewards.map(x => x.token.toLowerCase());

    const rewardTokenAddresses = rewardTokenAddressesRaw.filter(v => v !== this.NotSupportedToken);

    return [
      {
        address: multiFeeV2Address,
        underlyingTokenAddress: underlyingTokenAddressRaw.toLowerCase(),
        rewardTokenAddresses,
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<UwuLendMultiFeeV2, UwuLendLpStakingV2ContractPositionDefinition>) {
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

  getContract(address: string): UwuLendMultiFeeV2 {
    return this.contractFactory.uwuLendMultiFeeV2({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `Lp Staking V2`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<UwuLendMultiFeeV2>) {
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
