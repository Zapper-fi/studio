import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YieldProtocolPoolTokenFetcher } from '../common/yield-protocol.pool.token-fetcher';

@PositionTemplate()
export class EthereumYieldProtocolPoolTokenFetcher extends YieldProtocolPoolTokenFetcher {
  groupLabel = 'Pools';
  poolTokenAddresses = [
    '0x7acfe277ded15caba6a8da2972b1eb93fe1e2ccd',
    '0x1144e14e9b0aa9e181342c7e6e0a9badb4ced295',
    '0xfbc322415cbc532b54749e31979a803009516b5d',
    '0x8e8d6ab093905c400d583efd37fbeeb1ee1c0c39',
    '0xcf30a5a994f9ace5832e30c138c9697cda5e1247',
    '0x831df23f7278575ba0b136296a285600cd75d076',
    '0xbd6277e36686184a5343f83a4be5ced0f8cd185a',
    '0x1565f539e96c4d440c38979dbc86fd711c995dd6',
  ];
}
