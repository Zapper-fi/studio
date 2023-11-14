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
    key: ({ network, address, fromBlock }: { network: Network; fromBlock: number; address: string }) =>
      `rigoblock:${network}:rigoblock-logs:${address}:${fromBlock}:registered`,
    ttl: duration(8, 'hours').asSeconds(),
  })
  async getRigoblockRegisteredLogs({
    fromBlock,
    network,
    address,
  }: {
    address: string;
    network: Network;
    fromBlock: number;
  }) {
    const contract = this.contractFactory.poolRegistry({ network, address });
    const logs = await contract.getEvents.Registered({}, { fromBlock: BigInt(fromBlock) });
    return logs;
  }

  @Cache({
    key: ({ network, address, fromBlock }: { network: Network; fromBlock: number; address: string }) =>
      `rigoblock:${network}:rigoblock-logs:${address}:${fromBlock}:whitelisted`,
    ttl: duration(8, 'hours').asSeconds(),
  })
  async getRigoblockWhitelistedLogs({
    fromBlock,
    network,
    address,
  }: {
    address: string;
    network: Network;
    fromBlock: number;
  }) {
    const contract = this.contractFactory.tokenWhitelist({ network, address });
    const logs = await contract.getEvents.Whitelisted({}, { fromBlock: BigInt(fromBlock) });
    return logs;
  }
}
