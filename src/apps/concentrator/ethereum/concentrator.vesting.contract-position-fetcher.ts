import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isVesting } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { ConcentratorViemContractFactory } from '../contracts';
import { AladdinConcentratorVest } from '../contracts/viem';

@PositionTemplate()
export class EthereumConcentratorVestingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AladdinConcentratorVest> {
  groupLabel = 'Vesting';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorViemContractFactory) private readonly contractFactory: ConcentratorViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.aladdinConcentratorVest({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: '0x8341889905bdef85b87cb7644a93f7a482f28742' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.VESTING,
        address: '0xb3ad645db386d7f6d753b2b9c3f4b853da6890b8',
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0xb3ad645db386d7f6d753b2b9c3f4b853da6890b8',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AladdinConcentratorVest>) {
    const suppliedToken = contractPosition.tokens.find(isVesting)!;
    return `Vesting ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<AladdinConcentratorVest, DefaultDataProps>): Promise<BigNumberish[]> {
    const claimable = (await contract.read.getUserVest([address])).reduce(
      (claimable: BigNumber, current) =>
        claimable.add(BigNumber.from(current.vestingAmount).sub(current.claimedAmount)),
      BigNumber.from(0),
    );

    return Promise.all([contract.read.locked([address]), claimable]);
  }
}
