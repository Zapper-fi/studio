import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetPriceParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BadgerContractFactory } from '../contracts';

import { BadgerVaultTokenDefinitionsResolver } from './badger.vault.token-definition-resolver';

export type BadgerVaultTokenDataProps = {
  liquidity: number;
};

export abstract class BadgerVaultTokenFetcher<T extends Contract> extends AppTokenTemplatePositionFetcher<
  T,
  BadgerVaultTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BadgerVaultTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: BadgerVaultTokenDefinitionsResolver,
    @Inject(BadgerContractFactory) protected readonly contractFactory: BadgerContractFactory,
  ) {
    super(appToolkit);
  }

  private getVaultDefinitions() {
    return this.tokenDefinitionsResolver.getVaultDefinitions(this.network);
  }

  protected async selectVault(vaultAddress: string) {
    const vaultDefinitions = await this.getVaultDefinitions();
    return vaultDefinitions.find(v => v.address.toLowerCase() === vaultAddress) ?? null;
  }

  async getAddresses(): Promise<string[]> {
    const vaultDefinitions = await this.getVaultDefinitions();
    return vaultDefinitions.map(({ address }) => address.toLowerCase());
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<T>): Promise<string[]> {
    const vault = await this.selectVault(contract.address.toLowerCase());
    if (!vault) throw new Error('Cannot find specified vault');

    return [vault.underlyingAddress.toLowerCase()];
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<T>): Promise<number | number[]> {
    const yVaultContract = this.contractFactory.badgerYearnVault({ address: contract.address, network: this.network });
    const decimals = appToken.decimals;

    const ratioRaw =
      contract.address === '0x4b92d19c11435614cd49af1b589001b7c08cd4d5'
        ? await multicall.wrap(yVaultContract).pricePerShare()
        : await multicall.wrap(contract).getPricePerFullShare();

    return Number(ratioRaw) / 10 ** decimals;
  }

  async getPrice({ appToken, contract, multicall }: GetPriceParams<T>): Promise<number> {
    const reserve = Number(appToken.pricePerShare) * appToken.supply;
    const liquidity = reserve * appToken.tokens[0].price;

    let price = liquidity / appToken.supply;
    if (contract.address === '0x7e7e112a68d8d2e221e11047a72ffc1065c38e1a') {
      // bDIGG is a rebalancing token, calculate its price based on the underlying balance of DIGG
      const settContract = this.contractFactory.badgerSett({ address: contract.address, network: appToken.network });
      const contractDiggBalanceRaw = await multicall.wrap(settContract).balance();
      const contractDiggBalance = Number(contractDiggBalanceRaw) / 10 ** appToken.tokens[0].decimals;
      price = (contractDiggBalance / appToken.supply) * appToken.tokens[0].price;
    }
    return price;
  }

  async getDataProps(opts: GetDataPropsParams<T, BadgerVaultTokenDataProps>) {
    const { appToken } = opts;
    const reserve = Number(appToken.pricePerShare) * appToken.supply;
    const liquidity = reserve * appToken.tokens[0].price;

    return { liquidity };
  }
}
