import PQueue from 'p-queue';

export enum NetworkId {
  EthereumMainnet = '1',
  Kovan = '42',
  PolygonMainnet = '137',
  PolygonMumbai = '80001',
  CeloMainnet = '42220',
  CeloAlfajores = '44787',
}

type Reward = {
  tokenId: string;
  address: string;
  type: string;
};

/**
 * queue request and send request with support for throttling
 * @param {any} request The given request to send
 * @returns {Promise} A fulfilled promise after the request is processed
 */
const queue = new PQueue({ interval: 1000, intervalCap: 4 });
export async function sendRequestWithThrottle(request: any) {
  return queue.add(() => request);
}

/**
 * Wait for the given milliseconds
 * @param {number} milliseconds The given time to wait
 * @returns {Promise} A fulfilled promise after the given time has passed
 */
function waitFor(milliseconds: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Execute a promise and retry with exponential backoff
 * based on the maximum retry attempts it can perform
 * @param {function} onRetry callback executed on every retry
 * @param {number} maxRetries The maximum number of retries to be attempted
 * @returns {Promise} The result of the given promise passed in
 */
export async function retry(onRetry: (...args: any[]) => any, args: any[], maxRetries = 4): Promise<any> {
  async function retryWithBackoff(retries: number, retryAfter?: number) {
    try {
      if (retries > 0) {
        let timeToWait = 0;
        if (retryAfter) {
          timeToWait = retryAfter * 1000;
        } else {
          timeToWait = 1 * retries * 1000;
        }
        await waitFor(timeToWait);
      }
      return await onRetry(...args);
    } catch (e) {
      if (retries < maxRetries) {
        const retryAfter = e.response?.headers['retry-after'];
        if (!retryAfter) {
          return retryWithBackoff(retries + 1);
        }

        return retryWithBackoff(retries + 1, retryAfter);
      } else {
        console.warn('Max retries reached. Bubbling the error up');
        throw e;
      }
    }
  }
  return retryWithBackoff(0);
}

const ContractVersions = ['2.0'];

export const getGameVersionType = (contractVersion: string) => {
  const baseContractVersion = contractVersion.slice(0, 3);

  if (ContractVersions.indexOf(baseContractVersion) !== -1) {
    return true;
  }
  return false;
};

export type GamesResponse = Record<
  string,
  {
    displayId: number;
    networkId: string;
    depositToken: string;
    liquidityToken: string;
    rewardToken?: string;
    incentiveToken?: string;
    gameName: string;
    gameNameShort: string;
    contractVersion: string;
    isCapped: boolean;
    strategyProvider: string;
    paymentAmount: string;
    isWhitelisted: boolean;
    ggScore: number;
    id: string;
    gameStartsAt: string;
    segmentLength: string;
    totalSegmentCount: string;
    paymentCount: string;
    depositTokenAddress: string;
    liquidityTokenAddress: string;
    rewardTokenAddress?: string;
    incentiveTokenAddress?: string;
    currentSegment: string;
    earlyWithdrawalFee: string;
    performanceFee: string;
    rewards?: Reward[];
  }
>;

export const BASE_API_URL = 'https://goodghosting-api.com/v1';
