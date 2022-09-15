import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { ArthContractFactory, StabilityPool } from '../contracts';

@PositionTemplate()
export class EthereumArthStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StabilityPool> {
  groupLabel = 'Stability Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArthContractFactory) protected readonly contractFactory: ArthContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StabilityPool {
    return this.contractFactory.stabilityPool({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x2c360b513ae52947eeb37cfad57ac9b7c9373e1b' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x8cc0f052fff7ead7f2edcccac895502e884a8a71' }, // ARTH
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS }, // ETH
      { metaType: MetaType.CLAIMABLE, address: '0xb4d930279552397bba2ee473229f89ec245bc365' }, // MAHA
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<StabilityPool>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Stability Pool`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<StabilityPool, DefaultDataProps>) {
    return Promise.all([
      contract.getCompoundedARTHDeposit(address),
      contract.getDepositorETHGain(address),
      contract.getDepositorMAHAGain(address),
    ]);
  }
}
