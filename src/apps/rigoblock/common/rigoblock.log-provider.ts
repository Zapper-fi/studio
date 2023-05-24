import { Inject, Injectable } from '@nestjs/common';
import { Event } from 'ethers';
import moment from 'moment';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { RigoblockContractFactory } from '../contracts';

@Injectable()
export class RigoblockLogProvider {
  constructor(@Inject(RigoblockContractFactory) private readonly contractFactory: RigoblockContractFactory) {}

  // TODO: token whitelisted logs can even be updated once every week
  @Cache({
    key: ({ network, address, fromBlock, label }: { network: Network; fromBlock: number; address: string; label:string }) =>
      `rigoblock:${network}:rigoblock-logs:${address}:${fromBlock}:${label}`,
    ttl: moment.duration(1, 'hour').asSeconds(),
  })
  async getRigoblockLogs({
    fromBlock,
    network,
    address,
    label,
  }: {
    address: string;
    label: string;
    network: Network;
    fromBlock: number;
  }) {
    const contract = label === 'registered'
      ? this.contractFactory.poolRegistry({ network, address })
      : this.contractFactory.tokenWhitelist({ network, address });
    const mapper = <T extends Event>({ address, event, args }: T) => ({
      args: Array.from(args?.values() ?? []),
      address,
      event,
    });

    //label === 'registered' ? contract.filters.Registered() : contract.filters.Whitelisted(),
    const [rigoblockLogs] = await Promise.all([
      contract
        .queryFilter(
          contract.filters.Registered(),
          fromBlock
        )
        .then(logs => logs.map(mapper)),
    ]);

    return {
      //label === 'registered' ? rigoblockLogs : [...new Set(rigoblockLogs)],
      [label]: rigoblockLogs,
    };
  }
}
