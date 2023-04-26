import BigNumber from 'bignumber.js';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { WombatExchangePoolTokenFetcher } from '../common/wombat-exchange.pool.token-fetcher';
import { WombatExchangePoolToken } from '../contracts';

@PositionTemplate()
export class BinanceSmartChainWombatExchangePoolTokenFetcher extends WombatExchangePoolTokenFetcher {
  groupLabel = 'Pools';

  poolAddresses = [
    '0x312bc7eaaf93f1c60dc5afc115fccde161055fb0', // MAIN POOL
    '0x0520451b19ad0bb00ed35ef391086a692cfc74b2', // HAY Pool
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
    '0x9498563e47d7cfdfa22b818bb8112781036c201c', // Overnight Pool
  ];

  async getPricePerShare({ contract, multicall, appToken }: GetPricePerShareParams<WombatExchangePoolToken>) {
    const poolAddress = await contract.pool();
    const _pool = this.contractFactory.wombatExchangePool({ address: poolAddress, network: this.network });
    const pool = multicall.wrap(_pool);

    const amount = new BigNumber(10).pow(appToken.tokens[0].decimals).toFixed(0);

    const pricePerShareRaw = await pool.quotePotentialWithdraw(appToken.tokens[0].address, amount);
    const pricePerShare = Number(pricePerShareRaw.amount) / 10 ** appToken.decimals;
    return [pricePerShare];
  }
}
