import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { PhutureViemContractFactory } from '../contracts';
import { PhutureManagedIndex } from '../contracts/viem';

export type PhutureIndexAppTokenDefinition = {
  address: string;
  underlyingTokenAddresses: string[];
};

export abstract class PhutureIndexTokenFetcher extends AppTokenTemplatePositionFetcher<
  PhutureManagedIndex,
  DefaultAppTokenDataProps,
  PhutureIndexAppTokenDefinition
> {
  abstract managerAddress: string;
  abstract vTokenFactoryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PhutureViemContractFactory) protected readonly contractFactory: PhutureViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.phutureManagedIndex({ address, network: this.network });
  }

  getAddresses(): string[] {
    return [this.managerAddress];
  }

  async getUnderlyingTokenDefinitions() {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const managerContract = this.contractFactory.phutureManagedIndex({
      address: this.managerAddress,
      network: this.network,
    });

    const anatomy = await multicall.wrap(managerContract).read.anatomy();

    const underlyingTokenAddresses = anatomy[0].map(underlyingTokenAddress => underlyingTokenAddress.toLowerCase());

    return underlyingTokenAddresses.map(address => {
      return { address, network: this.network };
    });
  }

  async getPricePerShare({
    appToken,
    multicall,
  }: GetDataPropsParams<PhutureManagedIndex, DefaultAppTokenDataProps, PhutureIndexAppTokenDefinition>) {
    const vTokenFactoryContract = this.contractFactory.phutureVTokenFactory({
      network: this.network,
      address: this.vTokenFactoryAddress,
    });

    const reserves = await Promise.all(
      appToken.tokens.map(async token => {
        const vTokenAddressRaw = await multicall.wrap(vTokenFactoryContract).read.vTokenOf([token.address]);
        const vTokenContract = this.contractFactory.phutureVToken({
          address: vTokenAddressRaw.toLowerCase(),
          network: this.network,
        });
        const reserveRaw = await multicall.wrap(vTokenContract).read.assetBalanceOf([this.managerAddress]);
        const reserve = Number(reserveRaw) / 10 ** token.decimals;
        return reserve;
      }),
    );

    return reserves.map(r => r / appToken.supply);
  }

  async getLabel({ contract }: GetDisplayPropsParams<PhutureManagedIndex>) {
    return contract.read.name();
  }
}
