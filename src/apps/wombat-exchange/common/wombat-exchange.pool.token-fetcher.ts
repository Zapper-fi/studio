import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetAddressesParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { WombatExchangePoolToken, WombatExchangeContractFactory } from '../contracts';

export abstract class WombatExchangePoolTokenFetcher extends AppTokenTemplatePositionFetcher<WombatExchangePoolToken> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(WombatExchangeContractFactory) protected readonly contractFactory: WombatExchangeContractFactory,
  ) {
    super(appToolkit);
  }

  abstract poolAddresses: string[];

  getContract(address: string): WombatExchangePoolToken {
    return this.contractFactory.wombatExchangePoolToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const tokenAddressesByPool = await Promise.all(
      this.poolAddresses.map(async poolAddress => {
        const _poolContract = this.contractFactory.wombatExchangePool({ address: poolAddress, network: this.network });
        const poolContract = multicall.wrap(_poolContract);

        const paymentTokenAddresses = await poolContract.getTokens();
        const tokenAddresses = await Promise.all(paymentTokenAddresses.map(v => poolContract.addressOfAsset(v)));

        return tokenAddresses;
      }),
    );

    return tokenAddressesByPool.flat();
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<WombatExchangePoolToken>) {
    return [{ address: await contract.underlyingToken(), network: this.network }];
  }
}
