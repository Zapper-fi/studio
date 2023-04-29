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

import { XcaliburContractFactory, XcaliburSwapFactory, XcaliburRouter, UniswapPairV2, XcaliburToken} from '../contracts';

@PositionTemplate()
export class ArbitrumXcaliburPoolTokenFetcher extends AppTokenTemplatePositionFetcher<XcaliburToken> {
  groupLabel: string = 'Your Group Label';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(XcaliburContractFactory) private readonly caliburContractFactory: XcaliburContractFactory,
  ) {
    super(appToolkit);
  }

  getSwapFactory(address: string): XcaliburSwapFactory {
    return this.caliburContractFactory.xcaliburSwapFactory({ address, network: this.network });
  }
  
  getContract(address: string): XcaliburToken {
    return this.caliburContractFactory.xcaliburToken({ address, network: this.network });
  }

    // 57 lps
  async getPoolLength(contract: XcaliburSwapFactory): Promise<BigNumberish> {
    return contract.allPairsLength();
  }

  async getAddresses(params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    const contract = this.getSwapFactory(String(params));
    const allPairsLength = await this.getPoolLength(contract);
    
    const poolAddresses: string[] = [];
    for (let i = 0; i < allPairsLength; i++) {
      const poolAddress = await contract.allPairs(i);
      poolAddresses.push(poolAddress);
    }
    return poolAddresses;
  }

  async getUnderlyingTokenDefinitions(_params: GetUnderlyingTokensParams<XcaliburToken, DefaultAppTokenDefinition>): Promise<UnderlyingTokenDefinition[]> {
    const address = _params.contract.address;
    const pairContract = this.caliburContractFactory.uniswapPairV2({ address, network: this.network });
  
    const token0 = await pairContract.token0();
    const token1 = await pairContract.token1();
  
    const tokenDefinitions: UnderlyingTokenDefinition[] = [
      {
        address: token0,
        network: this.network,
        tokenId: 0,
      },
      {
        address: token1,
        network: this.network,
        tokenId: 1,
      },
    ];
  
    return tokenDefinitions;
  }
  

  async getPricePerShare(
    _params: GetPricePerShareParams<XcaliburToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    const address = _params.contract.address;
    const pairContract = this.caliburContractFactory.uniswapPairV2({ address, network: this.network });
  
    const reserves = await pairContract.getReserves();
    // Get tokens
    const reserve0 = BigNumber.from(reserves._reserve0);
    const reserve1 = BigNumber.from(reserves._reserve1);
  
    // Get the total supply of the app token
    const appTokenTotalSupply = await pairContract.totalSupply();
  
    // Calculate the ratio of the underlying tokens per app token
    const ratio0 = reserve0.mul(BigNumber.from(10).pow(18)).div(appTokenTotalSupply);
    const ratio1 = reserve1.mul(BigNumber.from(10).pow(18)).div(appTokenTotalSupply);
  
    // Convert the result to a number while preserving 18 decimal places
    const token0PerAppToken = parseFloat(ratio0.toString()) / 10 ** 18;
    const token1PerAppToken = parseFloat(ratio1.toString()) / 10 ** 18;
  
    return [token0PerAppToken, token1PerAppToken];
  }
}
