import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { LooksRareViemContractFactory } from '../contracts';
import { LooksRareFeeSharing } from '../contracts/viem';

@PositionTemplate()
export class EthereumLooksRareStakingV1ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LooksRareFeeSharing> {
  groupLabel = 'Staking V1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LooksRareViemContractFactory) protected readonly contractFactory: LooksRareViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.looksRareFeeSharing({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xbcd7254a1d759efa08ec7c3291b2e85c5dcc12ce' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<LooksRareFeeSharing>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.looksRareToken(), // LOOKS
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.rewardToken(), // WETH
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LooksRareFeeSharing>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<LooksRareFeeSharing>): Promise<BigNumberish[]> {
    const [suppliedBalance, claimableBalance] = await Promise.all([
      contract.read.calculateSharesValueInLOOKS([address]),
      contract.read.calculatePendingRewards([address]),
    ]);

    return [suppliedBalance, claimableBalance];
  }
}
