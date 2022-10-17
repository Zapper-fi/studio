import { Inject, Injectable } from '@nestjs/common';
import { Event } from 'ethers';
import moment from 'moment';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { PoolTogetherV3ContractFactory } from '../contracts';

export enum PoolWithMultipleWinnersBuilderCreatedType {
  STAKE = 'stake',
  YIELD = 'yield',
  COMPOUND = 'compound',
}

@Injectable()
export class PoolTogetherV3LogProvider {
  constructor(@Inject(PoolTogetherV3ContractFactory) private readonly contractFactory: PoolTogetherV3ContractFactory) {}

  @Cache({
    key: ({ network, address, fromBlock }: { network: Network; fromBlock: number; address: string }) =>
      `pool-together-v3:${network}:community-pool-builder-logs:${address}:${fromBlock}`,
    ttl: moment.duration(1, 'hour').asSeconds(),
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
    const mapper = <T extends Event>({ address, event, args }: T) => ({
      args: Array.from(args?.values() ?? []),
      address,
      event,
    });

    const [stakeLogs, compoundLogs, yieldLogs] = await Promise.all([
      contract
        .queryFilter(contract.filters.StakePrizePoolWithMultipleWinnersCreated(), fromBlock)
        .then(logs => logs.map(mapper)),
      contract
        .queryFilter(contract.filters.CompoundPrizePoolWithMultipleWinnersCreated(), fromBlock)
        .then(logs => logs.map(mapper)),
      contract
        .queryFilter(contract.filters.YieldSourcePrizePoolWithMultipleWinnersCreated(), fromBlock)
        .then(logs => logs.map(mapper)),
    ]);

    return {
      [PoolWithMultipleWinnersBuilderCreatedType.STAKE]: stakeLogs,
      [PoolWithMultipleWinnersBuilderCreatedType.COMPOUND]: compoundLogs,
      [PoolWithMultipleWinnersBuilderCreatedType.YIELD]: yieldLogs,
    };
  }
}
