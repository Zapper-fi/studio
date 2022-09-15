import { CallSite } from 'callsite';

export const getStack = () => {
  // Save original Error.prepareStackTrace
  const origPrepareStackTrace = Error.prepareStackTrace;

  // Override with function that just returns `stack`
  Error.prepareStackTrace = (_, stack) => stack;

  // Evaluate `Error.stack`, which calls our new `Error.prepareStackTrace`
  const stack = new Error().stack as unknown as CallSite[];

  // Restore original `Error.prepareStackTrace`
  Error.prepareStackTrace = origPrepareStackTrace;

  // Remove current stack call since redundant
  return stack.slice(1);
};
