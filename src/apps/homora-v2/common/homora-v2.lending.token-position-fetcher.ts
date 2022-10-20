import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { NETWORK_IDS } from '~types';

import { HomoraV2ContractFactory } from '../contracts';
import { CyToken } from '../contracts/ethers/CyToken';
import httpClient from '../helpers/httpClient';
import { SafeboxStatus } from '../interfaces/enums';
import { HomoraV2LendingPositionDataProps, HomoraV2LendingPositionDefinition, Safebox } from '../interfaces/interfaces';

export abstract class HomoraV2LendingTokenFetcher extends AppTokenTemplatePositionFetcher<
  CyToken,
  HomoraV2LendingPositionDataProps,
  HomoraV2LendingPositionDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HomoraV2ContractFactory) protected readonly contractFactory: HomoraV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CyToken {
    return this.contractFactory.cyToken({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    const safeboxes = await this.getSafeboxes();
    return safeboxes
      .filter(safebox => ![SafeboxStatus.delisted, SafeboxStatus.delisting].includes(safebox.status!))
      .map(safebox => safebox.cyTokenAddress);
  }

  async getDefinitions() {
    const addresses = await this.getSafeboxes();
    return addresses.map(({ address, cyTokenAddress, safeboxAddress }) => ({
      tokenAddress: address,
      address: cyTokenAddress,
      safeboxAddress,
    }));
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<CyToken>) {
    return contract.underlying();
  }

  async getSymbol({
    definition,
    multicall,
  }: GetTokenPropsParams<CyToken, HomoraV2LendingPositionDefinition>): Promise<string> {
    const tokenAddress = definition.tokenAddress;
    const erc20 = this.appToolkit.globalContracts.erc20({ address: tokenAddress, network: this.network });
    return multicall.wrap(erc20).symbol();
  }

  async getDecimals({
    definition,
    multicall,
  }: GetTokenPropsParams<CyToken, HomoraV2LendingPositionDefinition>): Promise<number> {
    const tokenAddress = definition.tokenAddress;
    const erc20 = this.appToolkit.globalContracts.erc20({ address: tokenAddress, network: this.network });
    return multicall.wrap(erc20).decimals();
  }

  async getSupply({ contract, multicall }: GetTokenPropsParams<CyToken, HomoraV2LendingPositionDefinition>) {
    const [currentCash, borrow] = await Promise.all([
      multicall.wrap(contract).getCash(),
      multicall.wrap(contract).totalBorrows(),
    ]);

    const totalSupply = currentCash.add(borrow);
    return totalSupply;
  }

  getLiquidity({ appToken }: GetDataPropsParams<CyToken>) {
    return appToken.supply * appToken.price;
  }

  getReserves({ appToken }: GetDataPropsParams<CyToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(): Promise<number> {
    return 0;
  }

  async getDataProps(
    params: GetDataPropsParams<CyToken, HomoraV2LendingPositionDataProps, HomoraV2LendingPositionDefinition>,
  ) {
    const { definition, contract, multicall, appToken } = params;
    const tokenAddress = definition.tokenAddress;
    const erc20 = this.appToolkit.globalContracts.erc20({ address: tokenAddress, network: this.network });
    const [borrow, decimals] = await Promise.all([
      multicall.wrap(contract).totalBorrows(),
      multicall.wrap(erc20).decimals(),
    ]);

    const supply = appToken.supply;
    const _borrow = Number(borrow) / 10 ** decimals;

    const utilization = (_borrow / (supply === 0 ? 1 : supply)) * 100; // Prevent 0/0

    const [liquidity, reserves, apy] = await Promise.all([
      this.getLiquidity(params),
      this.getReserves(params),
      this.getApy(),
    ]);

    return {
      supply: Number(supply),
      borrow: Number(_borrow),
      utilization: utilization.toFixed(2),
      liquidity,
      reserves,
      apy,
    };
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<
    CyToken,
    HomoraV2LendingPositionDataProps,
    HomoraV2LendingPositionDefinition
  >): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<
    CyToken,
    HomoraV2LendingPositionDataProps,
    HomoraV2LendingPositionDefinition
  >): Promise<string> {
    return appToken.symbol;
  }

  async getSafeboxes() {
    const chainId = NETWORK_IDS[this.network];
    const { data } = await httpClient.get<Safebox[]>(`${chainId}/safeboxes`);
    return data;
  }
}
