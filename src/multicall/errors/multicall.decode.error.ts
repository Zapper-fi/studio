export type MulticallWrappedReadDecodeErrorType = MulticallWrappedReadDecodeError & {
  name: 'MulticallWrappedReadDecodeError';
};

type MulticallWrappedReadDecodeErrorParams = {
  address: string;
  signature: string;
  args: any[];
  stack?: string;
};

export class MulticallWrappedReadDecodeError extends Error {
  override name = 'MulticallWrappedReadDecodeError';
  stack?: string;

  constructor({ address, signature, args, stack }: MulticallWrappedReadDecodeErrorParams) {
    super(`Multicall wrapped decode failed for ${address} for method ${signature} with args [${args.join(', ')}]`);
    this.stack = stack;
  }
}
