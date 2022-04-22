export type CurvePoolDefinition = {
  label?: string;
  swapAddress: string;
  tokenAddress: string;
  gaugeAddress?: string;
  streamAddress?: string;
  streamEol?: boolean;
  queryKey?: string;
  isLegacy?: boolean;
};
