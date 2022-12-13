import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { InsuraceMiningTokenFetcher } from '../common/insurace.mining.token-fetcher';

@PositionTemplate()
export class PolygonInsuraceMiningTokenFetcher extends InsuraceMiningTokenFetcher {
  groupLabel = 'Mining Pools';
  insurTokenAddress = '0x8a0e8b4b0903929f47c3ea30973940d4a9702067';
  stakersPoolV2Address = '0xd2171abb60d2994cf9acb767f2116cf47bbf596f';

  governanceMiningPools = [
    {
      address: '0xdbbb520b40c7b7c6498dbd532aee5e28c62b3611',
      underlyingTokenAddress: '0x8a0e8b4b0903929f47c3ea30973940d4a9702067', // INSUR
    },
  ];

  underwritingMiningPools = [
    {
      underlyingTokenAddress: ZERO_ADDRESS, // MATIC
      address: '0x599b132328a07b51b833609314824570a99ab9b0',
    },
    {
      underlyingTokenAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
      address: '0x09eaa5c29cb01b39b544db165f484a0d015e562b',
    },
    {
      underlyingTokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      address: '0xdecafc91000d4d3802a0562a8fb896f29b6a7480',
    },
    {
      underlyingTokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT
      address: '0xa29b59a149f62d390dee27b144c0092ca7dbba96',
    },
    {
      underlyingTokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', // WETH
      address: '0x563d10af7395db31f9b0030b39fc4e3ef2598fee',
    },
  ];

  liquidityMiningPools = [];
}
