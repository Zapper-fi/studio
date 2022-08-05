import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleContractFactory } from '../contracts';

type AaveSafetyModuleClaimableBalanceHelperParams = {
  address: string;
};

@Injectable()
export class AaveSafetyModuleClaimableBalanceHelper {
  private readonly stkAaveAddress = '0x4da27a545c0c5b758a6ba100e3a049001de870f5';
  private readonly stkAbptAddress = '0xa1116930326d21fb917d5a27f1e9943a9595fb47';
  private readonly aaveAddress = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) private readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {}

  async getBalances({ address }: AaveSafetyModuleClaimableBalanceHelperParams) {
    const network = Network.ETHEREUM_MAINNET;
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const aaveToken = baseTokens.find(p => p.address === this.aaveAddress);
    if (!aaveToken) return [];

    const stkAaveContract = this.contractFactory.stakedAave({ address: this.stkAaveAddress, network });
    const stkAbptContract = this.contractFactory.balancerStkAbpt({ address: this.stkAbptAddress, network });
    const [stkAaveRewardBalanceRaw, stkAbptRewardBalanceRaw] = await Promise.all([
      multicall.wrap(stkAaveContract).getTotalRewardsBalance(address),
      multicall.wrap(stkAbptContract).getTotalRewardsBalance(address),
    ]);

    const totalRewardBalanceRaw = new BigNumber(stkAaveRewardBalanceRaw.toString())
      .plus(stkAbptRewardBalanceRaw.toString())
      .toFixed(0);
    const rewardTokenBalance = [drillBalance(claimable(aaveToken), totalRewardBalanceRaw)];

    const dataProps = {};
    const displayProps = {
      label: `Claimable ${aaveToken.symbol}`,
      secondaryLabel: buildDollarDisplayItem(aaveToken.price),
      images: [getTokenImg(aaveToken.address, network)],
      statsItems: [],
    };

    const rewardPosition: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: this.stkAaveAddress,
      network,
      appId: AAVE_SAFETY_MODULE_DEFINITION.id,
      groupId: AAVE_SAFETY_MODULE_DEFINITION.groups.claimable.id,
      tokens: rewardTokenBalance,
      balanceUSD: rewardTokenBalance[0].balanceUSD,
      dataProps,
      displayProps,
    };

    return [rewardPosition];
  }
}
