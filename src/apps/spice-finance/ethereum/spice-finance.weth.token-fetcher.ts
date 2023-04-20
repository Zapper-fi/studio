import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc721 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetDataPropsParams,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { SpiceFinanceContractFactory } from '../contracts';
import { BigNumberish, constants } from 'ethers';
import { IMulticallWrapper } from '~multicall';
import { AppTokenPosition } from '~position/position.interface';

@PositionTemplate()
export class EthereumSpiceFinanceWethTokenFetcher extends AppTokenTemplatePositionFetcher<Erc721> {
  groupLabel = "WETH";

  vaultAddress = "0x6110d61DD1133b0f845f1025d6678Cd22A11a2fe";
  underlyingTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  constructor(
    @Inject(APP_TOOLKIT) public readonly appToolkit: IAppToolkit,
    @Inject(SpiceFinanceContractFactory) private readonly spiceFinanceContractFactory: SpiceFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc721 {
    return this.appToolkit.globalContracts.erc721({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return [this.vaultAddress];
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<Erc721, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: this.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare(
    _params: GetPricePerShareParams<Erc721, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    return [1];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<Erc721>) {
    const vault = this.spiceFinanceContractFactory.spiceFinanceNftVault({
      address: this.vaultAddress,
      network: this.network,
    });
    const reserveRaw = await vault.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ appToken }: GetDataPropsParams<Erc721>) {
    const vault = this.spiceFinanceContractFactory.spiceFinanceNftVault({
      address: this.vaultAddress,
      network: this.network,
    });
    const reserveRaw = await vault.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }

  async getBalancePerToken({ address }: {
    address: string;
    appToken: AppTokenPosition;
    multicall: IMulticallWrapper;
  }): Promise<BigNumberish> {
    const vault = this.spiceFinanceContractFactory.spiceFinanceNftVault({
      address: this.vaultAddress,
      network: this.network,
    });
    let balance = constants.Zero;
    for (let i = 1; i <= 555; ++i) {
      const owner = await vault.ownerOf(i);
      if (owner.toLowerCase() === address.toLowerCase()) {
        const shares = await vault.tokenShares(i);
        const assets = await vault.convertToAssets(shares);
        balance = balance.add(assets);
      }
    }
    return balance;
  }

  async getApy(_params: GetDataPropsParams<Erc721>) {
    return 0;
  }

  async getDecimals(_params: GetDataPropsParams<Erc721>): Promise<number> {
    return 0;
  }
}
