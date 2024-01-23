import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import {
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { HalofiViemContractFactory } from '../contracts';
import { HalofiAbi } from '../contracts/viem';

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
  HalofiAbi,
  DefaultDataProps,
  HalofiGameDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HalofiViemContractFactory) protected readonly contractFactory: HalofiViemContractFactory,
    @Inject(HalofiGameGamesApiSource) protected readonly gamesApiSource: HalofiGameGamesApiSource,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.halofiAbi({ address, network: this.network });
  }

  async getDefinitions(): Promise<HalofiGameDefinition[]> {
    return this.gamesApiSource.getGameConfigs(this.network!);
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<HalofiAbi, HalofiGameDefinition>): Promise<UnderlyingTokenDefinition[] | null> {
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

  async getLabel({ definition }: GetDisplayPropsParams<HalofiAbi, DefaultDataProps, HalofiGameDefinition>) {
    return definition.gameName;
  }

  // @ts-ignore
  getTokenBalancesPerPosition() {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const halofiContract = this.contractFactory.halofiAbi({
          address: contractPosition.address,
          network: this.network,
        });
        const player = await multicall.wrap(halofiContract).read.players([address]);

        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const balancesRaw: BigNumberish[] = [];

        if (!player[0] && stakedToken) {
          const paidAmount = parseFloat(player[7].toString());
          balancesRaw.push(paidAmount);
        }

        const nonZeroBalancesRaw = balancesRaw.filter(balance => Number(balance) > 0);
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
