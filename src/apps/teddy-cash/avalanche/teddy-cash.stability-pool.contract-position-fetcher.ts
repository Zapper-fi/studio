import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { TeddyCashContractFactory } from '../contracts';
import { TeddyCashStabilityPool } from '../contracts/ethers';

@PositionTemplate()
export class AvalancheTeddyCashStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TeddyCashStabilityPool> {
  groupLabel = 'Stability Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TeddyCashContractFactory) protected readonly contractFactory: TeddyCashContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TeddyCashStabilityPool {
    return this.contractFactory.teddyCashStabilityPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x7aed63385c03dc8ed2133f705bbb63e8ea607522' }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x4fbf0429599460d327bd5f55625e30e4fc066095' }, // TSD
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS }, // AVAX
      { metaType: MetaType.CLAIMABLE, address: '0x094bd7b2d99711a1486fb94d4395801c6d0fddcc' }, // TEDDY
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<TeddyCashStabilityPool>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Stability Pool`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<TeddyCashStabilityPool>) {
    return Promise.all([
      contract.getCompoundedLUSDDeposit(address),
      contract.getDepositorETHGain(address),
      contract.getDepositorLQTYGain(address),
    ]);
  }
}
