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

import { CryptexV2ContractFactory, Rebates } from '../contracts';

@PositionTemplate()
export class ArbitrumCryptexV2RebatesContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Rebates> {
  groupLabel = 'Rebates';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CryptexV2ContractFactory) protected readonly contractFactory: CryptexV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Rebates {
    return this.contractFactory.rebates({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x938f145d5f3abf681618dcc5c71f095b870747ba' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Rebates>) {
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

  async getLabel({ contractPosition }: GetDisplayPropsParams<Rebates>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Rebates>) {
    return Promise.all([contract.balanceOf(address), contract.earned(address)]);
  }
}
