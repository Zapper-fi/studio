import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { EulerTokenDefinitionsResolver } from '~apps/euler/common/euler.token-definition-resolver';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types';

const IPFS_HASH_MAPPING = {
  // [Network.ETHEREUM_MAINNET]: 'k51qzi5uqu5dhglpppd2ls4cc7mu34ik70ecsvfdyahjipjcuj03lw8iz8rvqm',
  [Network.ETHEREUM_MAINNET]: 'k51qzi5uqu5dm889k8q7u1jsgt4an0st16gwkrcvqftofp3qqfeuo4r27ejq0o',
};

interface IpfsName {
  value: string;
}

interface GetFarmDefinitionsProps {
  network: Network;
}

interface Market {
  underlying: string;
  eulDistribution?: {
    gauges?: {
      amount: string;
      APR: number;
    };
    staking?: {
      contractAddress: string;
      staked: {
        amount: string;
        valueETH: number;
        valueUSD: number;
      };
      rewardRate: string;
      APR: number;
      periodFinish: number;
    };
  };
}

interface EulerActivatedMarkets {
  markets: Market[];
}

@Injectable()
export class EulerApiStakingRegistry {
  constructor(
    @Inject(EulerTokenDefinitionsResolver) protected readonly tokenCacheManager: EulerTokenDefinitionsResolver,
  ) {}

  @CacheOnInterval({
    key: `studio:euler:single-staking-farm:staking-definitions-data`,
    timeout: 5 * 60 * 1000,
  })
  private getStakingDefinitionsData(opts?: GetFarmDefinitionsProps) {
    const ipfsHash = IPFS_HASH_MAPPING[opts?.network || Network.ETHEREUM_MAINNET];
    return axios
      .get<IpfsName>(`https://name.web3.storage/name/${ipfsHash}`)
      .then(ipfs =>
        axios
          .get<EulerActivatedMarkets>(
            `https://${ipfs.data.value.replace('/ipfs/', '')}.ipfs.w3s.link/EulerActivatedMarkets.json`,
          )
          .then(v => v.data.markets),
      );
  }

  async getStakingDefinitions(opts?: GetFarmDefinitionsProps) {
    const stakingDefinitions = await this.getStakingDefinitionsData(opts);

    return Promise.all(
      stakingDefinitions
        .filter(market => market.eulDistribution?.staking)
        .map(async ({ underlying, eulDistribution }) => {
          const market = await this.tokenCacheManager.getMarketByUnderlying(underlying);

          return {
            tokenAddress: underlying,
            eTokenAddress: market?.eTokenAddress ?? null,
            vaultAddress: eulDistribution?.staking?.contractAddress ?? '',
            apr: eulDistribution?.staking?.APR ?? null,
          };
        }),
    );
  }
}
