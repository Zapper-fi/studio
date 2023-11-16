export type MulticallWrappedInvalidAddressErrorType = MulticallWrappedInvalidAddressError & {
  name: 'MulticallWrappedInvalidAddressError';
};

type MulticallWrappedInvalidAddressErrorParams = {
  signature: string;
  args: any[];
  stack?: string;
};

export class MulticallWrappedInvalidAddressError extends Error {
  override name = 'MulticallWrappedInvalidAddressError';
  stack?: string;

  constructor({ signature, args, stack }: MulticallWrappedInvalidAddressErrorParams) {
    const argsString = `[${args.map(v => JSON.stringify(v)).join(', ')}]`;
    super(`Multicall invalid address provided for method ${signature} with args ${argsString}`);
    this.stack = stack;
  }
}
