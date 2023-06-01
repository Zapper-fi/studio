import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { CleverContractFactory, CleverFurnace } from '../contracts';

import { CVX, CLEVCVX } from './addresses';

@PositionTemplate()
export class EthereumCleverFurnaceContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CleverFurnace> {
  groupLabel = 'Furnace';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverContractFactory) protected readonly contractFactory: CleverContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CleverFurnace {
    return this.contractFactory.cleverFurnace({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xce4dcc5028588377e279255c0335effe2d7ab72a' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.LOCKED,
        address: CLEVCVX,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: CVX,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<CleverFurnace>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<CleverFurnace>) {
    const userInfo = await contract.userInfo(address);
    return [userInfo.unrealised, userInfo.realised];
  }
}
