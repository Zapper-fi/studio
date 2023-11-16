import { MulticallWrappedReadDecodeErrorType } from './multicall.decode.error';
import { MulticallWrappedReadRequestErrorType } from './multicall.request.error';

export type MulticallWrappedReadErrorType = MulticallWrappedReadRequestErrorType | MulticallWrappedReadDecodeErrorType;

export { MulticallWrappedReadRequestError, MulticallWrappedReadRequestErrorType } from './multicall.request.error';
export { MulticallWrappedReadDecodeError, MulticallWrappedReadDecodeErrorType } from './multicall.decode.error';

export const isViemMulticallUnderlyingError = (error: any): error is MulticallWrappedReadErrorType => {
  return error.name === 'MulticallWrappedReadRequestError' || error.name === 'MulticallWrappedReadDecodeError';
};
