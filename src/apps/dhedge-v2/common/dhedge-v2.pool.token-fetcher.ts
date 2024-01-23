import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getAppAssetImage, getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { DhedgeV2ViemContractFactory } from '../contracts';
import { DhedgeV2Token } from '../contracts/viem';

const customImg = new Set<string>(['BEAR', 'BTCy', 'BULL', 'dSNX', 'USDy', 'mlETH', 'USDmny', 'dUSD']);

export abstract class DhedgeV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<DhedgeV2Token> {
  abstract factoryAddress: string;
  abstract underlyingTokenAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DhedgeV2ViemContractFactory) protected readonly contractFactory: DhedgeV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.dhedgeV2Token({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const factory = this.contractFactory.dhedgeV2Factory({ address: this.factoryAddress, network: this.network });
    const deployedFunds = await multicall.wrap(factory).read.getDeployedFunds();
    return [...deployedFunds];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: this.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<DhedgeV2Token>) {
    const pricePerShareRaw = await contract.read.tokenPrice().catch(err => {
      if (isViemMulticallUnderlyingError(err)) return 0;
      throw err;
    });
    return [Number(pricePerShareRaw) / 10 ** 18];
  }

  async getReserves(_params: GetDataPropsParams<DhedgeV2Token>) {
    return [0]; // TBD
  }

  async getLabel({ contract }: GetDisplayPropsParams<DhedgeV2Token>) {
    return contract.read.name();
  }

  async getImages({
    appToken,
  }: GetDisplayPropsParams<DhedgeV2Token, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<string[]> {
    for (const img of customImg) {
      if (appToken.symbol.includes(img)) {
        return [getAppAssetImage(this.appId, img)];
      }
    }
    return [getAppImg(this.appId)];
  }
}
