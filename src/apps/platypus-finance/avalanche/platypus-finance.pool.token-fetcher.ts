import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PlatypusFinancePoolTokenFetcher } from '../common/platypus-finance.pool.token-fetcher';
import { PLATYPUS_FINANCE_DEFINITION } from '../platypus-finance.definition';

@Injectable()
export class AvalanchePlatypusFinancePoolTokenFetcher extends PlatypusFinancePoolTokenFetcher {
  appId = PLATYPUS_FINANCE_DEFINITION.id;
  groupId = PLATYPUS_FINANCE_DEFINITION.groups.pool.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Pools';

  poolAddresses = [
    // MAIN POOL
    '0x66357dcace80431aee0a7507e2e361b7e2402370',
    // ALT POOLS
    '0xb8e567fc23c39c94a1f6359509d7b43d1fbed824', // FRAX / USDC
    // '0xefa5d088a58a2d4ee5504102c5ffde69301527b0', // UST / USDC
    '0x30c30d826be87cd0a4b90855c2f38f7fcfe4eaa7', // MIM / USDC
    '0xc828d995c686aaba78a4ac89dfc8ec0ff4c5be83', // YUSD / USDC
    '0x4658ea7e9960d6158a261104aaa160cc953bb6ba', // sAVAX / WAVAX
    '0x39de4e02f76dbd4352ec2c926d8d64db8abdf5b2', // BTC.b / WBTC.e
    // FACTORY POOLS
    '0x91bb10d68c72d64a7ce10482b453153eea03322c', // USDC / TSD
    '0x233ba46b01d2fbf1a31bdbc500702e286d6de218', // USDC / H20
    '0x27912ae6ba9a54219d8287c3540a8969ff35500b', // USDC / MONEY
    // '0x1abb6bf97506c9b4ac985f558c4ee6eeb9c11f1d', // USDC / MAI
    '0x89e9efd9614621309ada948a761d364f0236edea', // USDC / USX
  ];
}
