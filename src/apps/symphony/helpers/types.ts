export type SymphonyYoloTokenDataProps = {
  liquidity: number;
};

export type Token = {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  extensions: {
    coingeckoId: string;
    isStablecoin: boolean;
    isNative: boolean;
    strategy: string;
  };
};
