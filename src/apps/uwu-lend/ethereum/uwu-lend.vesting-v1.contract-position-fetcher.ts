import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { UwuLendContractFactory, UwuLendMultiFeeV1 } from '../contracts';

export type UwuLendVestingV1ContractPositionDefinition = {
  address: string;
  rewardTokenAddress: string;
};

@PositionTemplate()
export class EthereumUwuLendVestingV1ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  UwuLendMultiFeeV1,
  DefaultDataProps,
  UwuLendVestingV1ContractPositionDefinition
> {
  groupLabel = 'Vesting V1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UwuLendContractFactory) protected readonly contractFactory: UwuLendContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<UwuLendVestingV1ContractPositionDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const multiFeeV1Address = '0x7c0bf1108935e7105e218bbb4f670e5942c5e237';
    const multiFeeV1Contract = this.contractFactory.uwuLendMultiFeeV1({
      address: multiFeeV1Address,
      network: this.network,
    });
    const rewardTokenAddressRaw = await multicall.wrap(multiFeeV1Contract).rewardToken();

    return [
      {
        address: multiFeeV1Address,
        rewardTokenAddress: rewardTokenAddressRaw.toLowerCase(),
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<UwuLendMultiFeeV1, UwuLendVestingV1ContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  getContract(address: string): UwuLendMultiFeeV1 {
    return this.contractFactory.uwuLendMultiFeeV1({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `Vesting`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<UwuLendMultiFeeV1>) {
    const earnedBalances = await contract.earnedBalances(address);
    const earned = earnedBalances.total;

    return [earned];
  }
}
