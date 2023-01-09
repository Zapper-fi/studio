import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { UwuLendContractFactory, UwuLendMultiFeeV2 } from '../contracts';

export type UwuLendVestingV2ContractPositionDefinition = {
  address: string;
  rewardTokenAddress: string;
};

@PositionTemplate()
export class EthereumUwuLendVestingV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  UwuLendMultiFeeV2,
  DefaultDataProps,
  UwuLendVestingV2ContractPositionDefinition
> {
  groupLabel = 'Vesting V2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UwuLendContractFactory) protected readonly contractFactory: UwuLendContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<UwuLendVestingV2ContractPositionDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const multiFeeV2Address = '0x0a7b2a21027f92243c5e5e777aa30bb7969b0188';
    const multiFeeV2Contract = this.contractFactory.uwuLendMultiFeeV2({
      address: multiFeeV2Address,
      network: this.network,
    });
    const rewardTokenAddressRaw = await multicall.wrap(multiFeeV2Contract).rewardToken();

    return [
      {
        address: multiFeeV2Address,
        rewardTokenAddress: rewardTokenAddressRaw.toLowerCase(),
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<UwuLendMultiFeeV2, UwuLendVestingV2ContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  getContract(address: string): UwuLendMultiFeeV2 {
    return this.contractFactory.uwuLendMultiFeeV2({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `Vesting`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<UwuLendMultiFeeV2>) {
    const earnedBalances = await contract.earnedBalances(address);
    const earned = earnedBalances.total;

    return [earned];
  }
}
