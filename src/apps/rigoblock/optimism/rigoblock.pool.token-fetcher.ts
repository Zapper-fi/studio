import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RigoblockPoolTokenFetcher } from '../common/rigoblock.pool.token-fetcher';

@PositionTemplate()
export class OptimismRigoblockPoolTokenFetcher extends RigoblockPoolTokenFetcher {
  groupLabel: string = 'Smart Pools';
  const blockedTokenAddresses = [
    '0xecf46257ed31c329f204eb43e254c609dee143b3', // GRG
    '0x7b0bcc23851bbf7601efc9e9fe532bf5284f65d3', // EST
    '0xe4f27b04cc7729901876b44f4eaa5102ec150265', // XCHF
    '0xd1917629b3e6a72e6772aab5dbe58eb7fa3c2f33', // ZRX
  ];
}
