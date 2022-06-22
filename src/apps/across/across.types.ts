export type AcrossPoolDefinition = {
  label?: string;
  poolAddress: string;
  tokenAddress: string;
  gaugeAddress?: string;
  queryKey?: string;
  isLegacy?: boolean;
};
