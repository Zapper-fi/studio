import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RigoblockPoolTokenFetcher } from '../common/rigoblock.pool.token-fetcher';

@PositionTemplate()
export class PolygonRigoblockPoolTokenFetcher extends RigoblockPoolTokenFetcher {
  groupLabel: string = 'Smart Pools';

  const blockedTokenAddresses = [
    '0xbc0bea8e634ec838a2a45f8a43e7e16cd2a8ba99', // GRG
    '0x3ba4c387f786bfee076a58914f5bd38d668b42c3', // BNB
    '0x0000000000000000000000000000000000001010', // MATIC
    '0x06d02e9d62a13fc76bb229373fb3bbbd1101d2fc', // LEO
    '0x210e69a578cfcdbb7a829c7c6379ac29e64a357a', // METADEX
    '0x09a84f900205b1ac5f3214d3220c7317fd5f5b77', // FREC
    '0x8cf745561791a43d70f75e85fbc6e3752395c5f0', // FUN
  ];
}
