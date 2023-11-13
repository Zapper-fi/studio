import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV3ViemContractFactory } from '~apps/uniswap-v3/contracts';
import { Erc20 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

export type PlutusVaultAppTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class ArbitrumPlutusPlsSpaTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  DefaultAppTokenDataProps,
  PlutusVaultAppTokenDefinition
> {
  groupLabel = 'Vault';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV3ViemContractFactory) protected readonly uniswapV3ContractFactory: UniswapV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address, network: this.network });
  }

  async getDefinitions(): Promise<PlutusVaultAppTokenDefinition[]> {
    return [
      {
        address: '0x0d111e482146fe9ac9ca3a65d92e65610bbc1ba6', // plsSPA
        underlyingTokenAddress: '0x5575552988a3a80504bbaeb1311674fcfd40ad4b',
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams<PlutusVaultAppTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ definition }: GetUnderlyingTokensParams<Erc20, PlutusVaultAppTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ multicall }: GetPricePerShareParams<Erc20>) {
    const uniswapV3PairContract = this.uniswapV3ContractFactory.uniswapV3Pool({
      address: '0x03344b394ccdb3c36ddd134f4962d2fa97e3e714',
      network: this.network,
    });
    const slot0 = await multicall.wrap(uniswapV3PairContract).read.slot0();
    const tickBasisConstant = 1.0001;

    const token0InTermOfToken1 = tickBasisConstant ** Math.abs(slot0[1]);
    const pricePerShare = 1 / token0InTermOfToken1;

    return [pricePerShare];
  }
}
