import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetPriceParams } from '~position/template/app-token.template.types';

import { AuraLockerRewardResolver } from '../common/aura.locker.reward-resolver';
import { AuraContractFactory } from '../contracts';
import { AuraDeposit } from '../contracts/ethers/AuraDeposit';

export type AuraBalTokenDefinition = {
  address: string;
};

@PositionTemplate()
export class EthereumAuraDepositTokenFetcher extends AppTokenTemplatePositionFetcher<AuraDeposit> {
  groupLabel = 'Deposit';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) protected readonly contractFactory: AuraContractFactory,
    @Inject(AuraLockerRewardResolver)
    private readonly lockerRewardResolver: AuraLockerRewardResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraDeposit {
    return this.contractFactory.auraDeposit({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x3fa73f1e5d8a792c80f426fc8f84fbf7ce9bbcac'];
  }

  async getUnderlyingTokenAddresses(): Promise<string[]> {
    const auraLocker = await this.lockerRewardResolver.getAuraLockerData();
    const rewardTokenAddress = auraLocker.rewardData.map(x => x.address);

    return ['0xc0c293ce456ff0ed870add98a0828dd4d2903dbf', ...rewardTokenAddress];
  }

  async getPrice({ appToken }: GetPriceParams<AuraDeposit>): Promise<number> {
    return appToken.tokens[0].price;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AuraDeposit>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<AuraDeposit>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
