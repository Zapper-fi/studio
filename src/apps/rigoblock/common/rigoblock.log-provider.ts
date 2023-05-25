import { Inject, Injectable } from '@nestjs/common';
import { Event } from 'ethers';
import moment from 'moment';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { RigoblockContractFactory } from '../contracts';

export enum PoolLogType {
  REGISTERED = 'registered',
  TOKEN_WHITELISTED = 'whitelisted',
}

@Injectable()
export class RigoblockLogProvider {
  constructor(@Inject(RigoblockContractFactory) private readonly contractFactory: RigoblockContractFactory) {}

  @Cache({
    key: ({ network, address, fromBlock, logType }: {
      network: Network;
      logType: PoolLogType;
      fromBlock: number;
      address: string;
    }) =>
      `rigoblock:${network}:rigoblock-logs:${address}:${fromBlock}:${logType}`,
    ttl: ({ logType }: { logType: PoolLogType }) => {
      logType === PoolLogType.REGISTERED
        ? moment.duration(1, 'hour').asSeconds()
        : moment.duration(48, 'hour').asSeconds()
      },
  })
  async getRigoblockLogs({
    fromBlock,
    network,
    address,
    logType,
  }: {
    address: string;
    logType: PoolLogType;
    network: Network;
    fromBlock: number;
  }) {
    const contract = logType === PoolLogType.REGISTERED
      ? this.contractFactory.poolRegistry({ network, address })
      : this.contractFactory.tokenWhitelist({ network, address });
    const mapper = <T extends Event>({ address, event, args }: T) => ({
      args: Array.from(args?.values() ?? []),
      address,
      event,
    });

    return await Promise.all([
      contract
        .queryFilter(
          logType === PoolLogType.REGISTERED
            ? contract.filters.Registered()
            : contract.filters.Whitelisted(),
          fromBlock,
        )
        .then(logs => logs.map(mapper)),
    ]);
  }
}
