import { Inject, Injectable } from '@nestjs/common';
import { duration } from 'moment';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { PoolTogetherV3ViemContractFactory } from '../contracts';

export enum PoolWithMultipleWinnersBuilderCreatedType {
  STAKE = 'stake',
  YIELD = 'yield',
  COMPOUND = 'compound',
}

@Injectable()
export class PoolTogetherV3LogProvider {
  constructor(
    @Inject(PoolTogetherV3ViemContractFactory) private readonly contractFactory: PoolTogetherV3ViemContractFactory,
  ) {}

  @Cache({
    key: ({ network, address, fromBlock }: { network: Network; fromBlock: number; address: string }) =>
      `pool-together-v3:${network}:community-pool-builder-logs:${address}:${fromBlock}`,
    ttl: duration(1, 'hour').asSeconds(),
  })
  async getPoolWithMultipleWinnersBuilderLogs({
    fromBlock,
    network,
    address,
  }: {
    address: string;
    network: Network;
    fromBlock: number;
  }) {
    const contract = this.contractFactory.poolTogetherV3PoolWithMultipleWinnersBuilder({ network, address });

    const [stakeLogs, compoundLogs, yieldLogs] = await Promise.all([
      contract.getEvents.StakePrizePoolWithMultipleWinnersCreated({}, { fromBlock: BigInt(fromBlock) }),
      contract.getEvents.CompoundPrizePoolWithMultipleWinnersCreated({}, { fromBlock: BigInt(fromBlock) }),
      contract.getEvents.YieldSourcePrizePoolWithMultipleWinnersCreated({}, { fromBlock: BigInt(fromBlock) }),
    ]);

    return {
      [PoolWithMultipleWinnersBuilderCreatedType.STAKE]: stakeLogs.map(log => ({
        prizePool: log.args.prizePool!,
        prizeStrategy: log.args.prizeStrategy!,
      })),
      [PoolWithMultipleWinnersBuilderCreatedType.COMPOUND]: compoundLogs.map(log => ({
        prizePool: log.args.prizePool!,
        prizeStrategy: log.args.prizeStrategy!,
      })),
      [PoolWithMultipleWinnersBuilderCreatedType.YIELD]: yieldLogs.map(log => ({
        prizePool: log.args.prizePool!,
        prizeStrategy: log.args.prizeStrategy!,
      })),
    };
  }
}
