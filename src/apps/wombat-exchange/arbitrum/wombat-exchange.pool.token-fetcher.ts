import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { WombatExchangePoolTokenFetcher } from '../common/wombat-exchange.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumWombatExchangePoolTokenFetcher extends WombatExchangePoolTokenFetcher {
  groupLabel = 'Pools';

  poolAddresses = [
    '0xc6bc781e20f9323012f6e422bdf552ff06ba6cd1', // MAIN POOL
    '0xcf20fda54e37f3fb456930f02fb07fccf49e4849', // Overnight Pool
    '0x29eeb257a2a6ecde2984acedf80a1b687f18ec91', // MIM Pool
    '0x917caf2b4d6040a9d67a5f8cefc4f89d1b214c1a', // BOB Pool
    '0x90ecddec4e4116e30769a4e1ea52c319aca338b6', // mWOM Pool
    '0xee9b42b40852a53c7361f527e638b485d49750cd', // wmxWOM Pool
    '0x12fa5ab079cff564d599466d39715d35d90af978', // qWOM Pool
    '0x4a8686df475d4c44324210ffa3fc1dea705296e0', // FRAX-MAI-USD Pool
    '0xe78876c360716f2225f55a6726b32324fe1b1145', // Cross Chain Pool
    '0x20d7ee728900848752fa280fad51af40c47302f1', // frxETH Pool
    '0xe14302040c0a1eb6fb5a4a79efa46d60029358d9', // wstETH Pool
    '0xb9bdfe449da096256fe7954ef61a18ee195db77b', // ankrETH Pool
    '0xc7a6ba5f28993badb566007bd2e0cb253c431974', // jUSDC Pool
    '0x956454c7be9318863297309183c79b793d370401', // fUSDC Pool
    '0xe7159f15e7b1d6045506b228a1ed2136dcc56f48', // mPENDLE Pool
  ];
}
