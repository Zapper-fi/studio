import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { ThalesViemContractFactory } from '../contracts';
import { LpStaking } from '../contracts/viem';

@PositionTemplate()
export class OptimismThalesPool2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LpStaking> {
  groupLabel = 'LP Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesViemContractFactory) private readonly contractFactory: ThalesViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.lpStaking({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: '0x31a20e5b7b1b067705419d57ab4f72e81cc1f6bf' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0xac6705bc7f6a35eb194bdb89066049d6f1b0b1b5',
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x217d47011b23bb961eb6d93ca9945b7501a5bb11',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LpStaking>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Staked ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<LpStaking>): Promise<BigNumberish[]> {
    return Promise.all([contract.read.balanceOf([address]), contract.read.earned([address])]);
  }
}
