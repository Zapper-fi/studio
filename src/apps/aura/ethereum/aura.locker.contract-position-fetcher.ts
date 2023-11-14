import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { AuraViemContractFactory } from '../contracts';
import { AuraLocker } from '../contracts/viem';

@PositionTemplate()
export class EthereumAuraLockerContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AuraLocker> {
  groupLabel = 'Vote Locked AURA';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraViemContractFactory) protected readonly contractFactory: AuraViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.auraLocker({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: '0x3fa73f1e5d8a792c80f426fc8f84fbf7ce9bbcac' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<AuraLocker>) {
    const stakedTokenAddress = await contract.read.stakingToken();
    const rewardTokenAddress = await contract.read.rewardTokens([BigInt(0)]);

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: stakedTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AuraLocker>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<AuraLocker, DefaultDataProps>): Promise<BigNumberish[]> {
    return Promise.all([
      contract.read.lockedBalances([address]).then(v => v[0]),
      contract.read.claimableRewards([address]).then(v => v[0].amount),
    ]);
  }
}
