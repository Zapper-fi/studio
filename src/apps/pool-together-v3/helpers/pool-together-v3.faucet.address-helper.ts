import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { PoolTogetherV3ContractFactory } from '../contracts';

type GetAddressesParams = {
  network: Network;
  poolAddress: string;
};

export class PoolTogetherV3FaucetAddressHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ContractFactory) private readonly contractFactory: PoolTogetherV3ContractFactory,
  ) {}

  @Cache({
    instance: 'business',
    key: ({ network, poolAddress }: GetAddressesParams) => `apps-v3:faucets:${network}:${poolAddress}`,
    ttl: 1 * 60 * 60, // 1 hour
  })
  async getAddresses({ network, poolAddress }: GetAddressesParams) {
    const multicall = this.appToolkit.getMulticall(network);

    // PoolTogether associates "faucets" for rewards to each prize pool. These are associated as listeners
    // on the assigned prize strategy of the pool.
    const poolContract = this.contractFactory.poolTogetherV3PrizePool({ address: poolAddress, network });
    const prizeStrategyAddressRaw = await multicall.wrap(poolContract).prizeStrategy();
    const prizeStrategyAddress = prizeStrategyAddressRaw.toLowerCase();
    const prizeStrategyContract = this.contractFactory.poolTogetherV3MultipleWinnersPrizeStrategy({
      address: prizeStrategyAddress,
      network,
    });

    // Get the token listener. If there's more than one, a MultiTokenListener contract address is returned.
    // We attempt a "flatmap" in this case by attempting a call to `MultiTokenListener.getAddresses`, and if it
    // fails, we just treat the assigned token listener as the faucet address.
    const tokenListenerAddressRaw = await multicall.wrap(prizeStrategyContract).tokenListener();
    const tokenListenerAddress = tokenListenerAddressRaw.toLowerCase();
    const tokenListenerContract = this.contractFactory.poolTogetherV3MultiTokenListener({
      address: tokenListenerAddress,
      network,
    });

    const faucetAddressesRaw = await multicall
      .wrap(tokenListenerContract)
      .getAddresses()
      .catch(() => [tokenListenerAddress]); // MultiTokenListener, or a Faucet
    const faucetAddresses = faucetAddressesRaw.map(t => t.toLowerCase());

    // For each faucet address, validate that it is in fact a faucet by attempting to call dripPerSecond
    const validFaucetAddressesRaw = await Promise.all(
      faucetAddresses.map(async faucetAddress => {
        const faucetContract = this.contractFactory.poolTogetherV3TokenFaucet({ address: faucetAddress, network });
        const maybeFaucetAddress: string | null = await multicall
          .wrap(faucetContract)
          .dripRatePerSecond()
          .then(() => faucetAddress)
          .catch(() => null);
        return maybeFaucetAddress;
      }),
    );

    return validFaucetAddressesRaw.filter(t => !!t);
  }
}
