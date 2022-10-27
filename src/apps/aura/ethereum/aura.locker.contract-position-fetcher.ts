import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { AuraLockerRewardResolver } from '../common/aura.locker.reward-resolver';
import { AuraContractFactory, AuraLocker } from '../contracts';

@PositionTemplate()
export class EthereumAuraLockerContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AuraLocker> {
  groupLabel = 'Locked AURA';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory)
    protected readonly contractFactory: AuraContractFactory,
    @Inject(AuraLockerRewardResolver)
    private readonly lockerRewardResolver: AuraLockerRewardResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraLocker {
    return this.contractFactory.auraLocker({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: '0x3fa73f1e5d8a792c80f426fc8f84fbf7ce9bbcac' }];
  }

  async getTokenDefinitions() {
    const auraLocker = await this.lockerRewardResolver.getAuraLockerData();
    const rewardTokenAddress = auraLocker.rewardData.map(x => x.address);
    const claimableTokens = rewardTokenAddress.map(token => {
      return { metaType: MetaType.CLAIMABLE, address: token };
    });

    return [
      { metaType: MetaType.LOCKED, address: '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf' },
      { metaType: MetaType.SUPPLIED, address: '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf' },
      ...claimableTokens,
    ];
  }

  async getLabel(): Promise<string> {
    return 'Vote-locked Aura (vlAURA)';
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<AuraLocker, DefaultDataProps>): Promise<BigNumberish[]> {
    const [lockedBalances, claimableRewards] = await Promise.all([
      contract.lockedBalances(address),
      contract.claimableRewards(address),
    ]);

    const { unlockable, locked } = lockedBalances;
    const claimable = claimableRewards.map(x => x.amount);

    return [locked, unlockable, ...claimable];
  }
}
