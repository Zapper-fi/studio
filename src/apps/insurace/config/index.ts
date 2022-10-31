import { Network } from '~types/network.interface';

export type InsuraceAppConfigMiningPool = {
  underlyingAddress: string;
  lpAddress: string;
};

export type InsuraceAppConfigItem = {
  blockTime: number;
  insur: string;
  contract: {
    StakersPoolV2: string;
  };
  governanceMiningPools: InsuraceAppConfigMiningPool[];
  underwritingMiningPools: InsuraceAppConfigMiningPool[];
  liquidityMiningPools: InsuraceAppConfigMiningPool[];
};

export type InsuraceAppConfig = {
  [key in Network]?: InsuraceAppConfigItem;
};

const appConfig: InsuraceAppConfig = {
  [Network.ETHEREUM_MAINNET]: {
    blockTime: 12,
    insur: '0x544c42fbb96b39b21df61cf322b5edc285ee7429',
    contract: {
      StakersPoolV2: '0x136d841d4bece3fc0e4debb94356d8b6b4b93209',
    },
    governanceMiningPools: [
      {
        underlyingAddress: '0x544c42fbb96b39b21df61cf322b5edc285ee7429', // INSUR
        lpAddress: '0x7e68521a2814a84868da716b9f436b53e6764c1d',
      },
    ],
    underwritingMiningPools: [
      {
        underlyingAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH
        lpAddress: '0xdf8bec949367b677b7c951219ed66035ddc73d3f',
      },
      {
        underlyingAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
        lpAddress: '0xee516e05cecfee5fe72930f3b38b87594434fd00',
      },
      {
        underlyingAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
        lpAddress: '0x5157e052ae30381e38874a9b3452aabc9f145182',
      },
      {
        underlyingAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        lpAddress: '0x3d9317a27f3d83f0821deeeb0befdb68d4c9cd47',
      },
      {
        underlyingAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        lpAddress: '0x8ce730bbaf5ed1b9e8cf2d857f474bdcdeb22275',
      },
      {
        underlyingAddress: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5', // mUSD
        lpAddress: '0xd9aae8f651f323cbb39e328b8fda741d11a231e0',
      },
    ],
    liquidityMiningPools: [
      {
        underlyingAddress: '0x169bf778a5eadab0209c0524ea5ce8e7a616e33b', // Uniswap V2 INSUR/USDC LP
        lpAddress: '0x07d8d49c5751566962a5169a9c8efdf64d1ca00b',
      },
    ],
  },
  [Network.BINANCE_SMART_CHAIN_MAINNET]: {
    blockTime: 3,
    insur: '0x3192ccddf1cdce4ff055ebc80f3f0231b86a7e30',
    contract: {
      StakersPoolV2: '0xd50e8ce9d5c1f5228bcc77e318907bb4960578ef',
    },
    governanceMiningPools: [
      {
        underlyingAddress: '0x3192ccddf1cdce4ff055ebc80f3f0231b86a7e30', // INSUR
        lpAddress: '0xa5eb163588e25f6de18b9e164ba39daa6086f52b',
      },
    ],
    underwritingMiningPools: [
      {
        underlyingAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // BNB
        lpAddress: '0x563d10af7395db31f9b0030b39fc4e3ef2598fee',
      },
      {
        underlyingAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
        lpAddress: '0xdbbb520b40c7b7c6498dbd532aee5e28c62b3611',
      },
      {
        underlyingAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
        lpAddress: '0xf2ce369b6e2b96952741af463dddd7061f565946',
      },
      {
        underlyingAddress: '0x55d398326f99059ff775485246999027b3197955', // USDT
        lpAddress: '0x22182ee443e109472fa3ff95311e4532ff5880f9',
      },
      {
        underlyingAddress: '0x2170ed0880ac9a755fd29b2688956bd959f933f8', // ETH
        lpAddress: '0x5b9d6666398b86e2541b08b00468ae6434f79441',
      },
    ],
    liquidityMiningPools: [],
  },
  [Network.POLYGON_MAINNET]: {
    blockTime: 2,
    insur: '0x8a0e8b4b0903929f47c3ea30973940d4a9702067',
    contract: {
      StakersPoolV2: '0xd2171abb60d2994cf9acb767f2116cf47bbf596f',
    },
    governanceMiningPools: [
      {
        underlyingAddress: '0x8a0e8b4b0903929f47c3ea30973940d4a9702067', // INSUR
        lpAddress: '0xdbbb520b40c7b7c6498dbd532aee5e28c62b3611',
      },
    ],
    underwritingMiningPools: [
      {
        underlyingAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // MATIC
        lpAddress: '0x599b132328a07b51b833609314824570a99ab9b0',
      },
      {
        underlyingAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
        lpAddress: '0x09eaa5c29cb01b39b544db165f484a0d015e562b',
      },
      {
        underlyingAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
        lpAddress: '0xdecafc91000d4d3802a0562a8fb896f29b6a7480',
      },
      {
        underlyingAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT
        lpAddress: '0xa29b59a149f62d390dee27b144c0092ca7dbba96',
      },
      {
        underlyingAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', // WETH
        lpAddress: '0x563d10af7395db31f9b0030b39fc4e3ef2598fee',
      },
    ],
    liquidityMiningPools: [],
  },
  [Network.AVALANCHE_MAINNET]: {
    blockTime: 2,
    insur: '0x544c42fbb96b39b21df61cf322b5edc285ee7429',
    contract: {
      StakersPoolV2: '0xf851cbb9940f8baebd1d0eaf259335c108e9e893',
    },
    governanceMiningPools: [
      {
        underlyingAddress: '0x544c42fbb96b39b21df61cf322b5edc285ee7429', // INSUR
        lpAddress: '0x563d10af7395db31f9b0030b39fc4e3ef2598fee',
      },
    ],
    underwritingMiningPools: [
      {
        underlyingAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // AVAX
        lpAddress: '0xdecafc91000d4d3802a0562a8fb896f29b6a7480',
      },
      {
        underlyingAddress: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
        lpAddress: '0xa29b59a149f62d390dee27b144c0092ca7dbba96',
      },
      {
        underlyingAddress: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664', // USDC.e
        lpAddress: '0x5b9d6666398b86e2541b08b00468ae6434f79441',
      },
      {
        underlyingAddress: '0xc7198437980c041c805a1edcba50c1ce5db95118', // USDT.e
        lpAddress: '0xdbbb520b40c7b7c6498dbd532aee5e28c62b3611',
      },
      {
        underlyingAddress: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', // WETH.e
        lpAddress: '0x22182ee443e109472fa3ff95311e4532ff5880f9',
      },
    ],
    liquidityMiningPools: [],
  },
};

export default appConfig;
