import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CamelotViemContractFactory } from '~apps/camelot/contracts';
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
export class ArbitrumPlutusPlsDpxTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  DefaultAppTokenDataProps,
  PlutusVaultAppTokenDefinition
> {
  groupLabel = 'Vault';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CamelotViemContractFactory) protected readonly camelotContractFactory: CamelotViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address, network: this.network });
  }

  async getDefinitions(): Promise<PlutusVaultAppTokenDefinition[]> {
    return [
      {
        address: '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
        underlyingTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
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
    const camelotPairContract = this.camelotContractFactory.camelotPair({
      address: '0x035d9815ae5af78d568721fa118bb93428c91f51',
      network: this.network,
    });
    const oneUnit = BigNumber.from(10).pow(18).toString();
    const pricePerShare = await multicall
      .wrap(camelotPairContract)
      .read.getAmountOut([BigInt(oneUnit), appToken.address]);

    return [Number(pricePerShare) / 10 ** appToken.decimals];
  }
}
