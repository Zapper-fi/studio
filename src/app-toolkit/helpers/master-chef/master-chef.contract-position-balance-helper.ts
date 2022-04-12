import { Inject, Injectable } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { WithMetaType } from '~position/display.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MasterChefContractPositionDataProps } from './master-chef.contract-position-helper';
import { MasterChefDefaultClaimableBalanceStrategy } from './master-chef.default.claimable-token-balances-strategy';
import { MasterChefDefaultStakedBalanceStrategy } from './master-chef.default.staked-token-balance-strategy';

export type MasterChefChefContractStrategy<T> = (opts: { network: Network; contractAddress: string }) => T;

export type MasterChefClaimableTokenBalanceStrategy<T> = (opts: {
  address: string;
  network: Network;
  multicall: Multicall;
  contract: T;
  contractPosition: ContractPosition<MasterChefContractPositionDataProps>;
}) => Promise<WithMetaType<TokenBalance>[]>;

export type MasterChefStakedTokenBalanceStrategy<T> = (opts: {
  address: string;
  network: Network;
  multicall: Multicall;
  contract: T;
  contractPosition: ContractPosition<MasterChefContractPositionDataProps>;
}) => Promise<WithMetaType<TokenBalance> | null>;

export type MasterChefContractPositionBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  resolveChefContract: MasterChefChefContractStrategy<T>;
  resolveStakedTokenBalance: MasterChefStakedTokenBalanceStrategy<T>;
  resolveClaimableTokenBalances: MasterChefClaimableTokenBalanceStrategy<T>;
};

@Injectable()
export class MasterChefContractPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MasterChefDefaultClaimableBalanceStrategy)
    private readonly defaultClaimableTokenStrategy: MasterChefDefaultClaimableBalanceStrategy,
    @Inject(MasterChefDefaultStakedBalanceStrategy)
    private readonly defaultStakedBalanceStrategy: MasterChefDefaultStakedBalanceStrategy,
  ) {}

  async getBalances<T>({
    address,
    network,
    appId,
    groupId,
    resolveChefContract,
    resolveStakedTokenBalance,
    resolveClaimableTokenBalances,
  }: MasterChefContractPositionBalanceHelperParams<T>): Promise<ContractPositionBalance[]> {
    const multicall = this.appToolkit.getMulticall(network);

    const contractPositions = await this.appToolkit.getAppContractPositions<MasterChefContractPositionDataProps>({
      network,
      appId,
      groupIds: [groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = resolveChefContract({ network, contractAddress: contractPosition.address });
        const [stakedTokenBalance, claimableTokenBalances] = await Promise.all([
          resolveStakedTokenBalance({
            address,
            network,
            contract,
            contractPosition,
            multicall,
          }),
          resolveClaimableTokenBalances({
            address,
            network,
            contract,
            contractPosition,
            multicall,
          }),
        ]);

        const tokens = [stakedTokenBalance!, ...claimableTokenBalances].filter(v => v.balanceUSD > 0);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        return {
          ...contractPosition,
          balanceUSD,
          tokens,
        };
      }),
    );

    return balances;
  }
}
