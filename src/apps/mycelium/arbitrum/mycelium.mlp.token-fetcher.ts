import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
} from '~position/template/app-token.template.types';

import { MyceliumContractFactory } from '../contracts';

export type MyceliumMlpTokenDefinition = {
  address: string;
  vaultAddress: string;
  underlyingTokenAddresses: string[];
};

@PositionTemplate()
export class ArbitrumMyceliumMlpTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  DefaultAppTokenDataProps,
  MyceliumMlpTokenDefinition
> {
  groupLabel = 'MLP';
  mlpManagerAddress = '0x2de28ab4827112cd3f89e5353ca5a8d80db7018f';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MyceliumContractFactory) protected readonly contractFactory: MyceliumContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ network: this.network, address });
  }

  async getDefinitions(): Promise<MyceliumMlpTokenDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const mlpManagerContract = this.contractFactory.myceliumMlpManager({
      address: this.mlpManagerAddress,
      network: this.network,
    });
    const vaultAddressRaw = await multicall.wrap(mlpManagerContract).vault();
    const vaultContract = this.contractFactory.myceliumVault({
      address: vaultAddressRaw.toLowerCase(),
      network: this.network,
    });

    const numTokens = await multicall.wrap(vaultContract).allWhitelistedTokensLength();
    const underlyingTokenAddressesRaw = await Promise.all(
      range(0, Number(numTokens)).map(async i => await multicall.wrap(vaultContract).allWhitelistedTokens(i)),
    );
    return [
      {
        address: '0x752b746426b6d0c3188bb530660374f92fd9cf7c',
        vaultAddress: vaultAddressRaw.toLowerCase(),
        underlyingTokenAddresses: underlyingTokenAddressesRaw.map(x => x.toLowerCase()),
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<Erc20, MyceliumMlpTokenDefinition>): Promise<UnderlyingTokenDefinition[]> {
    return definition.underlyingTokenAddresses.map(address => {
      return { address, network: this.network };
    });
  }

  async getPricePerShare({
    appToken,
    definition,
    multicall,
  }: GetPricePerShareParams<Erc20, DefaultAppTokenDataProps, MyceliumMlpTokenDefinition>) {
    const reserves = await Promise.all(
      appToken.tokens.map(async token => {
        const underlyingTokenContract = this.contractFactory.erc20({ address: token.address, network: this.network });
        const reserveRaw = await multicall.wrap(underlyingTokenContract).balanceOf(definition.vaultAddress);
        const reserve = Number(reserveRaw) / 10 ** token.decimals;
        return reserve;
      }),
    );

    return reserves.map(r => r / appToken.supply);
  }
}
