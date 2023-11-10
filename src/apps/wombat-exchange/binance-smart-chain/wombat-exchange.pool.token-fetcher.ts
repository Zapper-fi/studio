import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { WombatExchangePoolTokenFetcher } from '../common/wombat-exchange.pool.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainWombatExchangePoolTokenFetcher extends WombatExchangePoolTokenFetcher {
  groupLabel = 'Pools';

  poolAddresses = [
    '0x312bc7eaaf93f1c60dc5afc115fccde161055fb0', // MAIN POOL
    '0x0520451b19ad0bb00ed35ef391086a692cfc74b2', // Smart HAY Pool
    '0x0029b7e8e9ed8001c868aa09c74a1ac6269d4183', // BNB Pool
    '0x48f6a8a0158031baf8ce3e45344518f1e69f2a14', // FRAX Pool
    '0xeeb5a751e0f5231fc21c7415c4a4c6764f67ce2e', // wmxWOM Pool
    '0x083640c5dbd5a8ddc30100fb09b45901e12f9f55', // mWOM Pool
    '0x2c5464b9052319e3d76f8279031f04e4b7fd7955', // qWOM Pool
    '0x8df1126de13bcfef999556899f469d64021adbae', // BNBx Pool
    '0xb0219a90ef6a24a237bc038f7b7a6eac5e01edb0', // stkBNB Pool
    '0x277e777f7687239b092c8845d4d2cd083a33c903', // iUSD Pool
    '0x4dfa92842d05a790252a7f374323b9c86d7b7e12', // CUSD Pool
    '0x8ad47d7ab304272322513ee63665906b64a49da2', // axlUSDC Pool
    '0x05f727876d7c123b9bb41507251e2afd81ead09a', // USDD Pool
    '0xea6cdd9e8819bbf7f8791e7d084d9f0a6afa7892', // BOB Pool
    '0x9498563e47d7cfdfa22b818bb8112781036c201c', // Stable Guild Pool
    '0x6569ddc1cc2648c89bc8025046a7dd65eb8940f3', // Deprecated
    '0x1ee15673e07105bcf360139fa8cafebdd7754bef', // Cross chain Pool
    '0x2ea772346486972e7690219c190dadda40ac5da4', // frxETH Pool
    '0xb8b1b72a9b9ba90e2539348fec1ad6b265f9f684', // MIM Pool
    '0x6f1c689235580341562cdc3304e923cc8fad5bfa', // ankrBNB Pool
    '0xbed9b758a681d73a95ab4c01309c63aa16297b80', // BNBy Pool
    '0x8b892b6ea1d0e5b29b719d6bd6eb9354f1cde060', // wBETH Pool
    '0x1b507b97c89ede3e40d1b2ed92972197c6276d35', // ankrETH Pool
    '0xf1e604e9a31c3b575f91cf008445b7ce06bf3fef', // snBNB Pool
    '0x0592083b285aa75b9c8bad2485c6cccf93ccc348', // rBNB Pool
    '0x0c735f84bd7eda8f8176236091af8068bb6c41de', // USDS Pool
    '0x9a39f4ab3f52026432835dee6d3db721d95f3d28', // zBNB Pool
    '0xc26b7cbe7e695a0d11a8cb96140d1cd502945a2c', // zUSD Pool
  ];
}
