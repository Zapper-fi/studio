import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import {
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { HalofiContractFactory, HalofiAbiV001 } from '../contracts';

import { HalofiGameBalancesApiSource } from './halofi.game.balances.api-source';
import { HalofiGameGamesApiSource } from './halofi.game.games.api-source';

export type HalofiGameDefinition = {
  address: string;
  stakedTokenAddress: string;
  rewardTokenAddresses: string[];
  strategyProvider: string;
  contractVersion: string;
  gameName: string;
};

@Injectable()
export abstract class HalofiGameContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  HalofiAbiV001,
  DefaultDataProps,
  HalofiGameDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HalofiContractFactory) protected readonly contractFactory: HalofiContractFactory,
    @Inject(HalofiGameGamesApiSource) protected readonly gamesApiSource: HalofiGameGamesApiSource,
    @Inject(HalofiGameBalancesApiSource) protected readonly balancesApiSource: HalofiGameBalancesApiSource,
  ) {
    super(appToolkit);
  }

  getContract(address: string): HalofiAbiV001 {
    return this.contractFactory.halofiAbiV001({ address, network: this.network });
  }

  async getDefinitions(): Promise<HalofiGameDefinition[]> {
    return this.gamesApiSource.getGameConfigs(this.network!);
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<HalofiAbiV001, HalofiGameDefinition>): Promise<UnderlyingTokenDefinition[] | null> {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.stakedTokenAddress,
        network: this.network,
      },
      ...definition.rewardTokenAddresses.map(rewardTokenAddress => ({
        metaType: MetaType.CLAIMABLE,
        address: rewardTokenAddress,
        network: this.network,
      })),
    ];
  }

  async getLabel({ definition }: GetDisplayPropsParams<HalofiAbiV001, DefaultDataProps, HalofiGameDefinition>) {
    return definition.gameName;
  }

  // @ts-ignore
  getTokenBalancesPerPosition() {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const playerGameBalances = await this.balancesApiSource.getBalances(address, this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    const incentiveTokenIndex = 3;
    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const incentiveToken = contractPosition.tokens[incentiveTokenIndex];
        const incentiveOrRewardToken = incentiveToken ?? rewardToken;
        const balancesRaw: BigNumberish[] = [];

        if (!playerGameBalances[contractPosition.address]) {
          balancesRaw.push(...contractPosition.tokens.map(() => 0));
        } else {
          const { incentiveAmount, interestAmount, isWinner, paidAmount, rewardAmount } =
            playerGameBalances[contractPosition.address];

          const paidAmountRaw = paidAmount * 10 ** stakedToken.decimals;
          const interestAmountRaw = interestAmount * 10 ** stakedToken.decimals;

          const incentiveAmountRaw = incentiveAmount * 10 ** (incentiveOrRewardToken?.decimals ?? 0);
          const rewardAmountRaw = rewardAmount * 10 ** (rewardToken?.decimals ?? 0);
          const mayBeRewardAmountRaw = rewardAmountRaw < 0.01 ? incentiveAmountRaw : rewardAmountRaw;

          balancesRaw.push(paidAmountRaw);
          if (rewardToken && isWinner) balancesRaw.push(mayBeRewardAmountRaw);
          if (incentiveToken && isWinner) balancesRaw.push(incentiveAmountRaw);
          if (stakedToken && isWinner) balancesRaw.push(interestAmountRaw);
        }

        const nonZeroBalancesRaw = balancesRaw.filter(balance => balance > 0);
        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, nonZeroBalancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD };
        return balance;
      }),
    );

    return compact(balances);
  }
}
