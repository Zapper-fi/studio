import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Network } from '~types';

import { PolynomialContractFactory } from '../contracts';

@Injectable()
export class PolynomialAccountResolver {
  polynomialAccountResolverAddress = '0x4a0b3986cb7e23df85a64100bf222cf69f9787aa';
  network = Network.OPTIMISM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) protected readonly polynomialContractFactory: PolynomialContractFactory,
  ) {}

  async getSmartWalletAddress(address: string): Promise<string> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const accountResolver = this.polynomialContractFactory.polynomialAccountResolver({
      address: this.polynomialAccountResolverAddress,
      network: this.network,
    });
    const mcAccountResolver = multicall.wrap(accountResolver);
    const authorityAccounts = await mcAccountResolver.getAuthorityAccounts(address);
    if (authorityAccounts.length === 0) {
      return ZERO_ADDRESS;
    }
    const smartAccountAddress = authorityAccounts[0].toLowerCase();
    const accountAuthorities = await mcAccountResolver.getAccountAuthorities(smartAccountAddress);
    const mainOwnerAddress = accountAuthorities[0].toLowerCase();
    if (mainOwnerAddress != address) {
      return ZERO_ADDRESS;
    }
    return smartAccountAddress;
  }
}
