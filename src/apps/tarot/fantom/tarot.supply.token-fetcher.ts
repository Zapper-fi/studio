import { Inject } from '@nestjs/common';
import _, { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DisplayProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { TarotBorrowable, TarotContractFactory } from '../contracts';

type TarotSupplyDataProps = DefaultAppTokenDataProps & {
  poolTokenLabel: string;
};

type Definition = DefaultAppTokenDefinition & {
  poolTokenAddress: string;
  poolTokenLabel: string;
};

@PositionTemplate()
export class FantomTarotSupplyTokenFetcher extends AppTokenTemplatePositionFetcher<
  TarotBorrowable,
  TarotSupplyDataProps,
  Definition
> {
  groupLabel = 'Supply';
  isExcludedFromExplore = true;

  private tarotFactoryAddresses = [
    '0x35c052bbf8338b06351782a565aa9aad173432ea', // Tarot Classic
    '0xf6d943c8904195d0f69ba03d97c0baf5bbdcd01b', // Tarot Requiem
    '0xbf76f858b42bb9b196a87e43235c2f0058cf7322', // Tarot Carcosa
  ];

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(TarotContractFactory) private readonly contractFactory: TarotContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TarotBorrowable {
    return this.contractFactory.tarotBorrowable({ address, network: this.network });
  }

  private async getPoolTokenAddress({
    collateralAddress,
    multicall,
  }: GetDefinitionsParams & { collateralAddress: string }) {
    const collateralTokenContract = multicall.wrap(
      this.contractFactory.tarotBorrowable({
        network: this.network,
        address: collateralAddress,
      }),
    );

    const vaultTokenAddress = await collateralTokenContract.underlying();
    const vaultTokenContract = multicall.wrap(
      this.contractFactory.tarotBorrowable({ network: this.network, address: vaultTokenAddress }),
    );

    return await multicall.wrap(vaultTokenContract).underlying();
  }

  async getDefinitions({ multicall, tokenLoader }: GetDefinitionsParams): Promise<Definition[]> {
    const defs = await Promise.all(
      this.tarotFactoryAddresses.map(async tarotFactoryAddress => {
        const tarotFactory = multicall.wrap(
          this.contractFactory.tarotFactory({ address: tarotFactoryAddress, network: this.network }),
        );

        const numPoolsRaw = await tarotFactory.allLendingPoolsLength();

        return Promise.all(
          _.range(0, Number(numPoolsRaw)).map(async index => {
            const tarotVaultAddressRaw = await tarotFactory.allLendingPools(index);
            const tarotVaultAddress = tarotVaultAddressRaw.toLowerCase();

            const tarotVault = this.contractFactory.tarotVault({ network: this.network, address: tarotVaultAddress });
            const isVault = await multicall
              .wrap(tarotVault)
              .isVaultToken()
              .catch(() => false);
            if (!isVault) return null;

            const { borrowable0, borrowable1, collateral } = await tarotFactory.getLendingPool(tarotVaultAddress);
            const poolTokenAddress = await this.getPoolTokenAddress({
              multicall,
              tokenLoader,
              collateralAddress: collateral,
            });

            return [borrowable0, borrowable1].map(address => ({
              address: address.toLowerCase(),
              poolTokenAddress: poolTokenAddress.toLowerCase(),
            }));
          }),
        );
      }),
    ).then(defs => defs.flat().flat());

    // Only keep definitions which the pool token address is resolved
    const filteredDefs = await Promise.all(
      compact(defs).map(async def => {
        const match = await tokenLoader.getOne({ address: def.poolTokenAddress, network: this.network });
        if (!match) return null;
        return { ...def, poolTokenLabel: getLabelFromToken(match) };
      }),
    ).then(defs => compact(defs));

    // return compact(defs);
    return compact(filteredDefs);
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(({ address }) => address);
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<TarotBorrowable, Definition>) {
    return contract.underlying();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<TarotBorrowable>) {
    const exchangeRateRaw = await contract.callStatic.exchangeRate();
    return Number(exchangeRateRaw) / 10 ** appToken.decimals;
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<TarotBorrowable, TarotSupplyDataProps>): Promise<DisplayProps['label']> {
    const [underlyingToken] = appToken.tokens;
    return `${getLabelFromToken(underlyingToken)} in ${appToken.dataProps.poolTokenLabel} Lending Pool`;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<TarotBorrowable>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<TarotBorrowable>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }

  async getDataProps(params: GetDataPropsParams<TarotBorrowable, TarotSupplyDataProps, Definition>) {
    const defaultDataProps = await super.getDataProps(params);
    return { ...defaultDataProps, poolTokenLabel: params.definition.poolTokenLabel };
  }
}
