import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { LodestarFinanceContractFactory, LodestarFinanceToken, LodestarFinanceLens, LodestarFinancePool } from '../contracts';

@PositionTemplate()
export class ArbitrumLodestarFinancePoolTokenFetcher extends AppTokenTemplatePositionFetcher<LodestarFinanceToken> {
  groupLabel: "Pools";

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LodestarFinanceContractFactory)
    private readonly lodestarFinanceContractFactory: LodestarFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  // Lodestar Token
  getContract(address: string): LodestarFinanceToken {
    return this.lodestarFinanceContractFactory.lodestarFinanceToken({ address, network: this.network });
  }

  // Lens
  getLens(address: string): LodestarFinanceLens {
    return this.lodestarFinanceContractFactory.lodestarFinanceLens({ address, network: this.network });
  }

  // Pools
  getPool(address: string): LodestarFinancePool {
    return this.lodestarFinanceContractFactory.lodestarFinancePool({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    const poolAddresses = [
      "0x7b571111dAFf94287563582242eD29E5949970e",  // IUSDC
      "0x7A4729886D094a09f045120e78Bb0cEa44558b52", // IETH
      "0x01c7068Ea92D3da2A1dAD145C96C0F9398Be93f2", // IMAGIC
      "0xf81263eB84dfA118261cB9377F2c46Ca04689E6e", // IDPX
      "0xd917d67f9dD5fA3A193f1076C8c636867A3571b",  // IWBTC
      "0xe57390EB5F0dd76B545d7349845839Ad6A4faee8", // IARB
      "0x8c7B5F470251ED433e38215a959eeEFc900d995",  // IDAI
      "0x2d5a5306E6Cd7133AE576eb5eDB2128D79D11488", // IUSDT
      "0xD006E90a4A1aBFC560999bA2c3B0b70aa6b1B2f4", // IplvGLP
      "0xc9c043A7f80258d492121d2f34e829EB6517Eb17", // IFRAX
    ];
    return poolAddresses;
  }
  
  

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<LodestarFinanceToken, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    const address = _params.contract.address;
    const contract = this.getPool(address);
  
    const underlyingAsset = await contract.underlying();
  
    const tokenDefinition: UnderlyingTokenDefinition = {
      address: underlyingAsset,
      network: this.network,
      tokenId: 0, // only one asset/token, so set the tokenId to 0
    };
  
    return [tokenDefinition];
  }


  async getPricePerShare(
    _params: GetPricePerShareParams<LodestarFinanceToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    const address = _params.contract.address;
    const contract = this.getPool(address);

    // Get the underlying token in the pool
    const underlyingAsset = await contract.underlying();
    
    // Get the total supply
    const totalSupply = await contract.totalSupply();

    // Convert strings to BigNumber
    const underlyingAssetBN = BigNumber.from(underlyingAsset);
    const totalSupplyBN = BigNumber.from(totalSupply);

    // Calculate the price per share
    const pricePerShare = underlyingAssetBN.div(totalSupplyBN);

    // Convert the returned value to a number
    const pricePerShareNum = parseFloat(pricePerShare.toString()) / 1e18;

    return [pricePerShareNum];
  }
}
