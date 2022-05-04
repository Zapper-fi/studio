import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, isArray, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SingleStakingFarmDataProps } from '../position/single-staking-farm.contract-position-helper';
import { getImagesFromToken } from '../presentation/image.present';

import { drillBalance } from './token-balance.helper';

export type SingleStakingContractStrategy<T> = (opts: { address: string; network: Network }) => T;

export type SingleStakingStakedTokenBalanceStrategy<T> = (opts: {
  address: string;
  network: Network;
  multicall: Multicall;
  contract: T;
  contractPosition: ContractPosition<SingleStakingFarmDataProps>;
}) => BigNumberish | Promise<BigNumberish>;

export type SingleStakingRewardTokenBalanceStrategy<T> = (opts: {
  address: string;
  network: Network;
  multicall: Multicall;
  contract: T;
  contractPosition: ContractPosition<SingleStakingFarmDataProps>;
}) => BigNumberish | BigNumberish[] | Promise<BigNumberish | BigNumberish[]>;

export type SingleStakingContractPositionBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  farmFilter?: (farm: ContractPosition<SingleStakingFarmDataProps>) => boolean;
  resolveContract: SingleStakingContractStrategy<T>;
  resolveStakedTokenBalance: SingleStakingStakedTokenBalanceStrategy<T>;
  resolveRewardTokenBalances: SingleStakingRewardTokenBalanceStrategy<T>;
};

@Injectable()
export class SingleStakingContractPositionBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T>({
    address,
    network,
    appId,
    groupId,
    farmFilter,
    resolveContract,
    resolveStakedTokenBalance,
    resolveRewardTokenBalances,
  }: SingleStakingContractPositionBalanceHelperParams<T>): Promise<ContractPositionBalance[]> {
    const multicall = this.appToolkit.getMulticall(network);
    const contractPositions = await this.appToolkit.getAppContractPositions<SingleStakingFarmDataProps>({
      network,
      appId,
      groupIds: [groupId],
    });

    const filteredContractPositions = contractPositions.filter(farmFilter ? farmFilter : () => true);

    const balances = await Promise.all(
      filteredContractPositions.map(async contractPosition => {
        const contract = resolveContract({ address: contractPosition.address, network });
        const [stakedTokenBalanceRaw, rewardTokenBalancesRawAny] = await Promise.all([
          resolveStakedTokenBalance({
            address,
            network,
            contract,
            contractPosition,
            multicall,
          }),
          resolveRewardTokenBalances({
            address,
            network,
            contract,
            contractPosition,
            multicall,
          }),
        ]);

        const rewardTokenBalancesRaw = isArray(rewardTokenBalancesRawAny)
          ? rewardTokenBalancesRawAny
          : [rewardTokenBalancesRawAny];
        const stakedToken = contractPosition.tokens.find(v => v.metaType === MetaType.SUPPLIED);
        if (!stakedToken) return null;

        const stakedTokenBalance = drillBalance(stakedToken, stakedTokenBalanceRaw.toString());
        const rewardTokens = contractPosition.tokens.filter(v => v.metaType === MetaType.CLAIMABLE);
        const rewardTokenBalances = rewardTokens.map((v, i) =>
          drillBalance(v, rewardTokenBalancesRaw[i]?.toString() ?? '0'),
        );

        const tokens = [stakedTokenBalance, ...rewardTokenBalances].filter(v => v.balanceUSD > 0);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        return {
          ...contractPosition,
          displayProps: {
            ...contractPosition.displayProps,
            images: getImagesFromToken(stakedToken),
          },
          balanceUSD,
          tokens,
        };
      }),
    );

    return compact(balances);
  }
}
