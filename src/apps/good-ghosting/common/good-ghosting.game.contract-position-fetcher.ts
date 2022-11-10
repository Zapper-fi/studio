import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { GoodGhostingContractFactory, GoodghostingAbiV001 } from '../contracts';

import { GoodGhostingGameBalancesApiSource } from './good-ghosting.game.balances.api-source';
import { GoodGhostingGameGamesApiSource } from './good-ghosting.game.games.api-source';

export type GoodGhostingGameDefinition = {
  address: string;
  stakedTokenAddress: string;
  rewardTokenAddresses: string[];
  strategyProvider: string;
  contractVersion: string;
  gameName: string;
};

@Injectable()
export abstract class GoodGhostingGameContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  GoodghostingAbiV001,
  DefaultDataProps,
  GoodGhostingGameDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingContractFactory) protected readonly contractFactory: GoodGhostingContractFactory,
    @Inject(GoodGhostingGameGamesApiSource) protected readonly gamesApiSource: GoodGhostingGameGamesApiSource,
    @Inject(GoodGhostingGameBalancesApiSource) protected readonly balancesApiSource: GoodGhostingGameBalancesApiSource,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GoodghostingAbiV001 {
    return this.contractFactory.goodghostingAbiV001({ address, network: this.network });
  }

  async getDefinitions(): Promise<GoodGhostingGameDefinition[]> {
    return this.gamesApiSource.getGameConfigs(this.network!);
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<GoodghostingAbiV001, GoodGhostingGameDefinition>): Promise<
    UnderlyingTokenDefinition[] | null
  > {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.stakedTokenAddress },
      ...definition.rewardTokenAddresses.map(v => ({ metaType: MetaType.CLAIMABLE, address: v })),
    ];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<GoodghostingAbiV001, DefaultDataProps, GoodGhostingGameDefinition>) {
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

    const interestTokenIndex = 2;
    const incentiveTokenIndex = 3;

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const incentiveToken = contractPosition.tokens[incentiveTokenIndex];
        const interestToken = contractPosition.tokens[interestTokenIndex];
        const balancesRaw: BigNumberish[] = [];

        if (!playerGameBalances[contractPosition.address]) {
          balancesRaw.push(...contractPosition.tokens.map(() => 0));
        } else {
          const { incentiveAmount, interestAmount, isWinner, paidAmount, rewardAmount } =
            playerGameBalances[contractPosition.address];

          const paidAmountRaw = paidAmount * 10 ** stakedToken.decimals;
          const interestAmountRaw = interestAmount * 10 ** stakedToken.decimals;
          const incentiveAmountRaw = incentiveAmount * 10 ** incentiveToken.decimals;
          const maybeRewardAmountRaw = rewardAmount * 10 ** incentiveToken.decimals;
          const rewardAmountRaw = this.network === Network.CELO_MAINNET ? incentiveAmountRaw : maybeRewardAmountRaw;

          balancesRaw.push(paidAmountRaw);
          if (rewardToken && isWinner) balancesRaw.push(rewardAmountRaw);
          if (interestToken && isWinner) balancesRaw.push(interestAmountRaw);
          if (incentiveToken && isWinner) balancesRaw.push(incentiveAmountRaw);
        }

        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
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
