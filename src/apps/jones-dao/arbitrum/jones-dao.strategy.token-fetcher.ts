import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { JonesDaoContractFactory, JonesStrategyToken } from '../contracts';

export type JonesDaoStrategyTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class ArbitrumJonesDaoStrategyTokenFetcher extends AppTokenTemplatePositionFetcher<JonesStrategyToken> {
  groupLabel = 'Advanced Strategies';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoContractFactory) protected readonly contractFactory: JonesDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): JonesStrategyToken {
    return this.contractFactory.jonesStrategyToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<JonesDaoStrategyTokenDefinition[]> {
    return [
      {
        address: '0x7241bc8035b65865156ddb5edef3eb32874a3af6', // jGLP
        underlyingTokenAddress: '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258',
      },
      {
        address: '0xe66998533a1992ece9ea99cdf47686f4fc8458e0', // jUSDC
        underlyingTokenAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<JonesStrategyToken, JonesDaoStrategyTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ appToken, contract, multicall }: GetPricePerShareParams<JonesStrategyToken>) {
    const vaultAddressRaw = await contract.vaultToken();
    const glpVaultContract = this.contractFactory.jonesStrategyVault({
      address: vaultAddressRaw.toLowerCase(),
      network: this.network,
    });
    const oneUnit = ethers.BigNumber.from(10).pow(18);
    const pricePerShareRaw = await multicall.wrap(glpVaultContract).convertToAssets(oneUnit);
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return [pricePerShare];
  }
}
