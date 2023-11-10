import { Inject, Injectable } from '@nestjs/common';
import { Event } from 'ethers';
import { duration } from 'moment';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { RigoblockViemContractFactory } from '../contracts';

export enum PoolLogType {
  REGISTERED = 'registered',
  TOKEN_WHITELISTED = 'whitelisted',
}

@Injectable()
export class RigoblockLogProvider {
  constructor(@Inject(RigoblockViemContractFactory) private readonly contractFactory: RigoblockViemContractFactory) {}

  @Cache({
    key: ({
      network,
      address,
      fromBlock,
      logType,
    }: {
      network: Network;
      logType: PoolLogType;
      fromBlock: number;
      address: string;
    }) => `rigoblock:${network}:rigoblock-logs:${address}:${fromBlock}:${logType}`,
    ttl: duration(8, 'hours').asSeconds(),
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
    switch (logType) {
      case PoolLogType.REGISTERED: {
        const contract = this.contractFactory.poolRegistry({ network, address });
        const logs = await contract.getEvents.Registered({}, { fromBlock: BigInt(fromBlock) });
        return logs;
      }

      case PoolLogType.TOKEN_WHITELISTED: {
        const contract = this.contractFactory.tokenWhitelist({ network, address });
        const logs = await contract.getEvents.Whitelisted({}, { fromBlock: BigInt(fromBlock) });
        return logs;
      }

      default: {
        throw new Error(`Unknown log type: ${logType}`);
      }
    }
  }
}
