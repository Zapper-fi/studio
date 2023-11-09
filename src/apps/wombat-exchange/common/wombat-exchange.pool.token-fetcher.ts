import { Inject } from '@nestjs/common';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetAddressesParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { WombatExchangeViemContractFactory } from '../contracts';
import { WombatExchangePoolToken } from '../contracts/viem';

export abstract class WombatExchangePoolTokenFetcher extends AppTokenTemplatePositionFetcher<WombatExchangePoolToken> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(WombatExchangeViemContractFactory) protected readonly contractFactory: WombatExchangeViemContractFactory,
  ) {
    super(appToolkit);
  }

  abstract poolAddresses: string[];

  getContract(address: string) {
    return this.contractFactory.wombatExchangePoolToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const tokenAddressesByPool = await Promise.all(
      this.poolAddresses.map(async poolAddress => {
        const _poolContract = this.contractFactory.wombatExchangePool({ address: poolAddress, network: this.network });
        const poolContract = multicall.wrap(_poolContract);

        const paymentTokenAddresses = await poolcontract.read.getTokens();
        const tokenAddresses = await Promise.all(paymentTokenAddresses.map(v => poolcontract.read.addressOfAsset([v])));

        return tokenAddresses;
      }),
    );

    return uniq(tokenAddressesByPool.flat());
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<WombatExchangePoolToken>) {
    return [{ address: await contract.read.underlyingToken(), network: this.network }];
  }
}
