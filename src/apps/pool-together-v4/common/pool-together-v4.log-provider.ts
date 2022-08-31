import { Inject, Injectable } from '@nestjs/common';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { PoolTogetherV4ContractFactory } from '../contracts';

export enum PoolWithMultipleWinnersBuilderCreatedType {
  STAKE = 'stake',
  YIELD = 'yield',
  COMPOUND = 'compound',
}

@Injectable()
export class PoolTogetherV4LogProvider {
  constructor(@Inject(PoolTogetherV4ContractFactory) private readonly contractFactory: PoolTogetherV4ContractFactory) {}

  @Cache({
    key: ({ network, address, fromBlock }: { network: Network; fromBlock: number; address: string }) =>
      `pool-together-v4:${network}:community-pool-builder-logs:${address}:${fromBlock}`,
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
    const contract = this.contractFactory.poolTogetherV4PoolWithMultipleWinnersBuilder({ network, address });
    const [stakeLogs, compoundLogs, yieldLogs] = await Promise.all([
      contract.queryFilter(contract.filters.StakePrizePoolWithMultipleWinnersCreated(), fromBlock),
      contract.queryFilter(contract.filters.CompoundPrizePoolWithMultipleWinnersCreated(), fromBlock),
      contract.queryFilter(contract.filters.YieldSourcePrizePoolWithMultipleWinnersCreated(), fromBlock),
    ]);

    return {
      [PoolWithMultipleWinnersBuilderCreatedType.STAKE]: stakeLogs,
      [PoolWithMultipleWinnersBuilderCreatedType.COMPOUND]: compoundLogs,
      [PoolWithMultipleWinnersBuilderCreatedType.YIELD]: yieldLogs,
    };
  }
}
