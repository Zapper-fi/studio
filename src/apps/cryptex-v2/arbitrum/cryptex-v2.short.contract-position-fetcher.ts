import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { CryptexV2ContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumCryptexV2RebatesContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Short> {
  groupLabel = 'Short';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CryptexV2ContractFactory) protected readonly contractFactory: CryptexV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Short {
    return this.contractFactory.short({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x4243b34374cfb0a12f184b92f52035d03d4f7056' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Short>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.stakingToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.rewardsToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Short>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Short>) {
    return Promise.all([contract.balanceOf(address), contract.earned(address)]);
  }
}
