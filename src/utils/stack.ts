import { CallSite } from 'callsite';

export function getStack() {
  // Save original Error.prepareStackTrace
  const origPrepareStackTrace = Error.prepareStackTrace;

  // Override with function that just returns `stack`
  Error.prepareStackTrace = function (_, stack) {
    return stack;
  };

  // Create a new `Error`, which automatically gets `stack`
  const err = new Error();

  // Evaluate `err.stack`, which calls our new `Error.prepareStackTrace`
  const stack = err.stack as unknown as CallSite[];

  // Restore original `Error.prepareStackTrace`
  Error.prepareStackTrace = origPrepareStackTrace;

  // Remove current stack call since redundant
  stack.shift();

  return stack;
}
