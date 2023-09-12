import BigNumber from 'bignumber.js';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { WombatExchangePoolTokenFetcher } from '../common/wombat-exchange.pool.token-fetcher';
import { WombatExchangePoolToken } from '../contracts';

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
  ];

  async getPricePerShare({ contract, multicall, appToken }: GetPricePerShareParams<WombatExchangePoolToken>) {
    const poolAddress = await contract.pool();
    const _pool = this.contractFactory.wombatExchangePool({ address: poolAddress, network: this.network });
    const pool = multicall.wrap(_pool);

    const amount = new BigNumber(10).pow(18).toFixed(0);

    const pricePerShareRaw = await pool.quotePotentialWithdraw(appToken.tokens[0].address, amount);
    const pricePerShare = Number(pricePerShareRaw.amount) / 10 ** appToken.tokens[0].decimals;
    return [pricePerShare];
  }
}
