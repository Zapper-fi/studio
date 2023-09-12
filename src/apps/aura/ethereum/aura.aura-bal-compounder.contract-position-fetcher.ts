import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

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

import { AuraBalVirtualRewardPool, AuraContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumAuraAuraBalCompounderContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AuraBalVirtualRewardPool> {
  groupLabel = 'auraBAL Compounder';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) protected readonly contractFactory: AuraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraBalVirtualRewardPool {
    return this.contractFactory.auraBalVirtualRewardPool({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: '0xac16927429c5c7af63dd75bc9d8a58c63ffd0147' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<AuraBalVirtualRewardPool>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.deposits(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.rewardToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AuraBalVirtualRewardPool>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<AuraBalVirtualRewardPool>): Promise<BigNumberish[]> {
    return Promise.all([contract.balanceOf(address), contract.earned(address)]);
  }
}
