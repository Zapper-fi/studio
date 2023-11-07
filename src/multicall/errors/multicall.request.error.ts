export type MulticallWrappedReadRequestErrorType = MulticallWrappedReadRequestError & {
  name: 'MulticallWrappedReadRequestError';
};

type MulticallWrappedReadRequestErrorParams = {
  address: string;
  signature: string;
  args: any[];
  stack?: string;
};

export class MulticallWrappedReadRequestError extends Error {
  override name = 'MulticallWrappedReadRequestError';
  stack?: string;

  constructor({ address, signature, args, stack }: MulticallWrappedReadRequestErrorParams) {
    super(`Multicall wrapped request failed for ${address} for method ${signature} with args [${args.join(', ')}]`);
    this.stack = stack;
  }
}
