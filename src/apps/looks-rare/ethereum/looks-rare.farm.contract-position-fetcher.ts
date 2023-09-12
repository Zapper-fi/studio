import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { LooksRareContractFactory, LooksRareFeeSharing } from '../contracts';

@PositionTemplate()
export class EthereumLooksRareFarmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LooksRareFeeSharing> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LooksRareContractFactory) protected readonly contractFactory: LooksRareContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LooksRareFeeSharing {
    return this.contractFactory.looksRareFeeSharing({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xbcd7254a1d759efa08ec7c3291b2e85c5dcc12ce' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<LooksRareFeeSharing>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.looksRareToken(), // LOOKS
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.rewardToken(), // WETH
        network: this.network,
      },
    ];
  }

  async getLabel() {
    return 'Standard Method';
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<LooksRareFeeSharing, DefaultDataProps>): Promise<BigNumberish[]> {
    const [suppliedBalance, claimableBalance] = await Promise.all([
      contract.calculateSharesValueInLOOKS(address),
      contract.calculatePendingRewards(address),
    ]);

    return [suppliedBalance, claimableBalance];
  }
}
