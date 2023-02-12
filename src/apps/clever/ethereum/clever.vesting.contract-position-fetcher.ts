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
    return [{ address: '0x84C82d43f1Cc64730849f3E389fE3f6d776F7A4E' }];
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
    const locked = await contract.locked(address)
    const toBeClaimed = (await contract.getUserVest(address)).reduce((claimable: BigNumber, current) => claimable.add(current[0].sub(current[1])), BigNumber.from(0));

    const claimable = toBeClaimed.sub(locked)

    return Promise.all([locked, claimable]);
  }
}
