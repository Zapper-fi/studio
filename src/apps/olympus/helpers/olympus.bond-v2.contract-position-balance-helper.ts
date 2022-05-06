import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isClaimable, isVesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { OlympusContractFactory } from '../contracts';

type OlympusBondV2ContractPositionBalanceHelperParams = {
  address: string;
  appId: string;
  groupId: string;
  network: Network;
};

@Injectable()
export class OlympusBondV2ContractPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) private readonly contractFactory: OlympusContractFactory,
  ) {}

  async getBalances(opts: OlympusBondV2ContractPositionBalanceHelperParams): Promise<ContractPositionBalance[]> {
    const { address, appId, groupId, network } = opts;
    const multicall = this.appToolkit.getMulticall(network);
    const contractPositions = await this.appToolkit.getAppContractPositions({ network, appId, groupIds: [groupId] });
    const contractPositionBalances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = this.contractFactory.olympusV2BondDepository({ address: contractPosition.address, network });
        const vestingToken = contractPosition.tokens.find(isVesting)!;
        const claimableToken = contractPosition.tokens.find(isClaimable)!;

        const indexes = await multicall.wrap(contract).indexesFor(address);
        const pendingBonds = await Promise.all(
          indexes.map(index => multicall.wrap(contract).pendingFor(address, index)),
        );

        const claimableBonds = pendingBonds.filter(p => p.matured_);
        const vestingBonds = pendingBonds.filter(p => !p.matured_);

        const claimableAmount = claimableBonds.reduce((acc, bond) => acc.add(bond.payout_), BigNumber.from('0'));
        const vestingAmount = vestingBonds.reduce((acc, bond) => {
          return acc.add(bond.payout_);
        }, BigNumber.from('0'));
        const claimableTokenBalance = drillBalance(claimableToken, claimableAmount.toString());
        const vestingTokenBalance = drillBalance(vestingToken, vestingAmount.toString());
        const tokens = [claimableTokenBalance, vestingTokenBalance].filter(v => v.balanceUSD > 0);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        return { ...contractPosition, tokens, balanceUSD };
      }),
    );

    return contractPositionBalances;
  }
}
