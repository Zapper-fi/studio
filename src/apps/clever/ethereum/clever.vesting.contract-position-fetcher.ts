import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isVesting } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { CleverContractFactory, CleverVesting } from '../contracts';

import { CLEV } from './addresses';

@PositionTemplate()
export class EthereumCleverVestingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CleverVesting> {
  groupLabel = 'Vesting';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverContractFactory) private readonly contractFactory: CleverContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CleverVesting {
    return this.contractFactory.cleverVesting({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: '0x84c82d43f1cc64730849f3e389fe3f6d776f7a4e' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.VESTING,
        address: CLEV,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: CLEV,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<CleverVesting>) {
    const suppliedToken = contractPosition.tokens.find(isVesting)!;
    return `Vesting ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<CleverVesting, DefaultDataProps>): Promise<BigNumberish[]> {
    const locked = await contract.locked(address);
    const userVesting = await contract.getUserVest(address);
    const toBeClaimbedRaw = userVesting.map(x => {
      return Number(x.vestingAmount) - Number(x.claimedAmount);
    });

    const toBeClaimed = _.sum(toBeClaimbedRaw);

    const claimable = toBeClaimed - Number(locked);

    return Promise.all([locked, claimable]);
  }
}
