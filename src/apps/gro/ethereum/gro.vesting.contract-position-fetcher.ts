import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { GroViemContractFactory } from '../contracts';
import { GroVesting } from '../contracts/viem';

@PositionTemplate()
export class EthereumGroVestingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<GroVesting> {
  groupLabel = 'Vesting';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GroViemContractFactory) private readonly contractFactory: GroViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.groVesting({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: '0x748218256afe0a19a88ebeb2e0c5ce86d2178360' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x3ec8798b81485a254928b70cda1cf0a2bb0b74d7',
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x3ec8798b81485a254928b70cda1cf0a2bb0b74d7',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<GroVesting>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Vesting ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<GroVesting, DefaultDataProps>): Promise<BigNumberish[]> {
    return Promise.all([contract.read.vestedBalance([address]), contract.read.vestingBalance([address])]);
  }
}
