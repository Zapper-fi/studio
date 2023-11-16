import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, range } from 'lodash';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts/viem';
import { ViemMulticallDataLoader } from '~multicall';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

export type CurvePoolTokenDataProps = DefaultAppTokenDataProps & {
  swapAddress: string;
  volume: number;
  fee: number;
};

export type CurvePoolDefinition = {
  address: string;
  swapAddress: string;
  isLegacy?: boolean;
};

export type ResolvePoolCoinAddressParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  multicall: ViemMulticallDataLoader;
  index: number;
};

export type ResolvePoolReserveParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  multicall: ViemMulticallDataLoader;
  index: number;
};

export type ResolvePoolFeeParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  multicall: ViemMulticallDataLoader;
};

export abstract class CurvePoolStaticTokenFetcher<T extends Abi> extends AppTokenTemplatePositionFetcher<
  Erc20,
  CurvePoolTokenDataProps,
  CurvePoolDefinition
> {
  abstract poolDefinitions: CurvePoolDefinition[];

  abstract resolvePoolContract(definition: CurvePoolDefinition): GetContractReturnType<T, PublicClient>;
  abstract resolvePoolCoinAddress(opts: ResolvePoolCoinAddressParams<T>): Promise<string>;
  abstract resolvePoolReserve(opts: ResolvePoolReserveParams<T>): Promise<BigNumberish>;
  abstract resolvePoolFee(opts: ResolvePoolFeeParams<T>): Promise<BigNumberish>;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address, network: this.network });
  }

  async getDefinitions() {
    return this.poolDefinitions;
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    multicall,
    definition,
  }: GetUnderlyingTokensParams<Erc20, CurvePoolDefinition>) {
    const contract = multicall.wrap(this.resolvePoolContract(definition));

    const coinAddressesRaw = await Promise.all(
      range(0, 4).map(index =>
        this.resolvePoolCoinAddress({ multicall, contract, index }).catch(err => {
          if (isViemMulticallUnderlyingError(err)) return null;
          throw err;
        }),
      ),
    );

    const underlyingTokenAddresses = compact(coinAddressesRaw)
      .filter(v => v !== ZERO_ADDRESS)
      .map(v => v.toLowerCase())
      .map(v => v.replace(ETH_ADDR_ALIAS, ZERO_ADDRESS));

    return underlyingTokenAddresses.map(address => ({ address, network: this.network }));
  }

  async getPricePerShare({
    multicall,
    definition,
    appToken,
  }: GetPricePerShareParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const contract = multicall.wrap(this.resolvePoolContract(definition));
    const coinsRange = range(0, appToken.tokens.length);
    const reservesRaw = await Promise.all(
      coinsRange.map(index => this.resolvePoolReserve({ multicall, contract, index })),
    );

    const reserves = reservesRaw.map((v, i) => Number(v) / 10 ** appToken.tokens[i].decimals);
    const pricePerShare = reserves.map(v => v / appToken.supply);
    return pricePerShare;
  }

  async getDataProps(params: GetDataPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const defaultDataProps = await super.getDataProps(params);

    const { multicall, definition } = params;
    const contract = multicall.wrap(this.resolvePoolContract(definition));
    const swapAddress = definition.swapAddress;

    const feeRaw = await this.resolvePoolFee({ contract, multicall });
    const fee = Number(feeRaw) / 10 ** 8;
    const volume = 0; // not supported
    const apy = 0; // not supported

    return { ...defaultDataProps, fee, volume, apy, swapAddress };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const reservesUSD = appToken.tokens.map((t, i) => appToken.dataProps.reserves[i] * t.price);
    const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
    const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);
    const ratio = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');

    return ratio;
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const { liquidity, volume, apy, fee } = appToken.dataProps;

    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Volume', value: buildDollarDisplayItem(volume) },
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Fee', value: buildPercentageDisplayItem(fee) },
    ];
  }
}
