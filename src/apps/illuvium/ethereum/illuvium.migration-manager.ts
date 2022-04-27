import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { IlluviumContractFactory } from '../contracts';
import { ILLUVIUM_DEFINITION } from '../illuvium.definition';

type MerkleBalanceEntry = {
  account: string;
  pendingV1Rewards: {
    type: string;
    hex: string;
  };
  weight: {
    type: string;
    hex: string;
  };
};

@Injectable()
export class EthereumIlluviumMigrationManager {
  private readonly ILV_MIGRATE_ADDRESS = '0x7f5f854ffb6b7701540a00c69c4ab2de2b34291d';

  constructor(@Inject(IlluviumContractFactory) private readonly contractFactory: IlluviumContractFactory) {}

  @CacheOnInterval({
    key: `studio:${ILLUVIUM_DEFINITION.id}:${Network.ETHEREUM_MAINNET}:merkle-balances`,
    timeout: 15 * 60 * 1000,
  })
  async getMerkleBalances() {
    const ipfsHost = process.env.IPFS_HOST || 'https://cf-ipfs.com';
    const endpoint = `${ipfsHost}/ipfs/QmTT8nx2QMbJYsyavKvsBLZ76veT8jN6zQ1sxcaqR5GDg9`;
    const result = await Axios.get<MerkleBalanceEntry[]>(endpoint).then(v => v.data);
    return result;
  }

  async hasMigrated(address: string) {
    const merkleBalances = await this.getMerkleBalances();
    const index = merkleBalances.findIndex(v => v.account.toLowerCase() === address);
    if (index === -1) return false;

    const migrateContract = this.contractFactory.illuviumIlvPoolV2({
      address: this.ILV_MIGRATE_ADDRESS,
      network: Network.ETHEREUM_MAINNET,
    });

    const hasMigrated = await migrateContract.hasMigratedYield(index);
    return hasMigrated;
  }
}
