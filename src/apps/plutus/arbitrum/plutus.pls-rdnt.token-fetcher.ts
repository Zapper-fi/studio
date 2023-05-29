import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ChronosContractFactory } from '~apps/chronos/contracts';
import { Erc20 } from '~contract/contracts';
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
export class ArbitrumPlutusPlsRdntTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  DefaultAppTokenDataProps,
  PlutusVaultAppTokenDefinition
> {
  groupLabel = 'Vault';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ChronosContractFactory) protected readonly chronosContractFactory: ChronosContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.appToolkit.globalContracts.erc20({ address, network: this.network });
  }

  async getDefinitions(): Promise<PlutusVaultAppTokenDefinition[]> {
    return [
      {
        address: '0x1605bbdab3b38d10fa23a7ed0d0e8f4fea5bff59', // plsRDNT
        underlyingTokenAddress: '0x3082cc23568ea640225c2467653db90e9250aaa0',
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams<PlutusVaultAppTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ definition }: GetUnderlyingTokensParams<Erc20, PlutusVaultAppTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<Erc20>) {
    const chronosPairContract = this.chronosContractFactory.chronosPool({
      address: '0x3fb69d8720816a604487f2fd5813b72c15dd77ea',
      network: this.network,
    });
    const oneUnit = BigNumber.from(10).pow(18);
    const pricePerShare = await multicall.wrap(chronosPairContract).getAmountOut(oneUnit, appToken.address);

    return [Number(pricePerShare) / 10 ** appToken.decimals];
  }
}
