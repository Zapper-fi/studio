export type SymphonyYoloTokenDataProps = {
  totalValueLocked: number;
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
